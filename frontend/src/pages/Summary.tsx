import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { SummaryHeader } from '@/components/app/SummaryHeader';
import type { SummaryState } from '@/lib/types';
import { ApiEndpoints } from '@/lib/constants';
import { ResponseTextArea } from '@/components/app/ResponseTextArea';

export function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null)

  const state = location.state as SummaryState | null;
  const isValidState = state?.username && state.startDate && state.endDate && state.model && [true, false].includes(state.useCustomDates) && state.selectedQuarter

  const handleEventSourceCleanup = () => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
  }

  const handleEventSourceMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.done) {
        handleEventSourceCleanup()
        setIsGenerating(false)
        return
      }

      if (data.content) {
        setSummary((prev) => prev + data.content);
        setIsGenerating(true);
      }
    } catch (err) {
      console.error('Error parsing SSE data:', err);
      handleEventSourceCleanup()
      setIsGenerating(false)
    }
  }, [])

  const handleEventSourceError = useCallback((event: Event) => {
    handleEventSourceCleanup()
    setIsGenerating(false)
    setError('Failed to generate summary. Please try again.');
    console.error(event)
  }, [])

  useEffect(() => {
    if (!isValidState) {
      navigate('/')
      return;
    }

    const { username, organization, startDate, endDate, model } = state
    const params = new URLSearchParams({
      username,
      startDate,
      endDate,
      model,
    });

    if (organization) {
      params.append('orgName', organization);
    }

    const eventSource = new EventSource(ApiEndpoints.generateSummary(params.toString()));
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event: MessageEvent) => handleEventSourceMessage(event)
    eventSource.onerror = (err) => handleEventSourceError(err)

    return () => {
      handleEventSourceCleanup()
    }
    // the functions are stable
  }, [isValidState, state, handleEventSourceError, handleEventSourceMessage, navigate]);

  if (!isValidState) {
    navigate('/')
    return
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold text-xl mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <SummaryHeader
        {...state}
      />
      <div className='min-h-[600px] flex flex-col'>
        {!isGenerating && !summary.length ? (
          <div className='bg-grey rounded-lg p-5 flex gap-2 flex-1 justify-center items-center text-white text-center'>
            <Spinner />
            <p>Generating your summary</p>
          </div>
        ) : <ResponseTextArea value={summary} />}
      </div>
      {summary && !isGenerating && (
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-primary rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Generate Another Summary
          </button>
        </div>
      )}
    </div>
  );
}
