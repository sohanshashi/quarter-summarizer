import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import type { SummaryState } from '@/lib/types';
import { ApiEndpoints } from '@/lib/constants';

export function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null)

  const state = location.state as SummaryState | null;
  const isValidState = state?.username && state.startDate && state.endDate && state.model

  const handleEventSourceCleanup = () => {
    setIsLoading(false)
    eventSourceRef.current?.close()
    eventSourceRef.current = null
  }

  const handleEventSourceMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.done) {
        handleEventSourceCleanup()
        return
      }

      if (data.content) {
        setSummary((prev) => prev + data.content);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error parsing SSE data:', err);
      handleEventSourceCleanup()
    }
  }, [])

  const handleEventSourceError = useCallback((event: Event) => {
    handleEventSourceCleanup()
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Your AI Summary</h1>
        <div className="text-muted-foreground">
          <p>
            Generated for <span className="font-medium text-foreground">{state?.username}</span>
            {state?.organization && (
              <> at <span className="font-medium text-foreground">{state.organization}</span></>
            )}
          </p>
          <p className="text-sm mt-1">
            {state?.startDate} to {state?.endDate} • Model: {state?.model}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-lg border p-8 min-h-[500px]">
        {isLoading && !summary && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner />
            <div className="text-center">
              <p className="text-lg font-medium">Generating your summary...</p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a minute while we analyze your pull requests
              </p>
            </div>
          </div>
        )}

        {summary && (
          <div className="prose prose-lg max-w-none dark:prose-invert text-black">
            <div className="whitespace-pre-wrap font-sans leading-relaxed">
              {summary}
            </div>
          </div>
        )}

        {isLoading && summary && (
          <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
            <Spinner size="sm" />
            <span className="ml-2">Streaming content...</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-[#E07856] text-white rounded-md hover:bg-[#E07856]/90 transition-colors font-medium"
        >
          Generate Another Summary
        </button>
        {summary && !isLoading && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(summary);
              // You could add a toast notification here
              alert('Summary copied to clipboard!');
            }}
            className="px-6 py-2.5 border border-input rounded-md hover:bg-accent transition-colors font-medium"
          >
            Copy to Clipboard
          </button>
        )}
      </div>
    </div>
  );
}
