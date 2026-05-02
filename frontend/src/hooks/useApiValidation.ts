import { useState, useEffect, useMemo, useRef } from "react";

import type { ApiValidationResult } from "@/lib/types";
import { hasRequestAborted } from "@/lib/utils";

type RequestSnapshot = {
  valueAtRequest: string;
  status: "valid" | "invalid";
  message?: string;
} | null;

type UseApiValidationOptions = {
  value: string;
  url: string;
  /**
   * Optional local validation on the trimmed value. Return a message to treat the
   * field as invalid (no API request); return `undefined` to allow the fetch.
   */
  validationFn?: (trimmed: string) => string | undefined;
  debounceMs?: number;
  notFoundMessage?: string;
  errorMessage?: string;
};

export function useApiValidation({
  value,
  url,
  validationFn,
  debounceMs = 500,
  notFoundMessage = "Not found",
  errorMessage = "Unable to verify",
}: UseApiValidationOptions): ApiValidationResult {
  const [requestSnapshot, setRequestSnapshot] = useState<RequestSnapshot>(null);
  const validationFnRef = useRef(validationFn);

  useEffect(() => {
    validationFnRef.current = validationFn;
  }, [validationFn]);

  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    const localError = validationFnRef.current?.(trimmed);
    if (localError) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (controller.signal.aborted) return;

        if (res.ok) {
          setRequestSnapshot({ valueAtRequest: trimmed, status: "valid" });
        } else if (res.status === 404) {
          setRequestSnapshot({
            valueAtRequest: trimmed,
            status: "invalid",
            message: notFoundMessage,
          });
        } else {
          setRequestSnapshot({
            valueAtRequest: trimmed,
            status: "invalid",
            message: errorMessage,
          });
        }
      } catch (err) {
        if (hasRequestAborted(err)) return;
        setRequestSnapshot({
          valueAtRequest: trimmed,
          status: "invalid",
          message: errorMessage,
        });
      }
    }, debounceMs);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [value, url, debounceMs, notFoundMessage, errorMessage]);

  return useMemo((): ApiValidationResult => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { status: "idle" };
    }

    const localError = validationFn?.(trimmed);
    if (localError) {
      return { status: "invalid", message: localError };
    }

    if (!requestSnapshot || requestSnapshot.valueAtRequest !== trimmed) {
      return { status: "checking" };
    }

    return {
      status: requestSnapshot.status,
      message: requestSnapshot.message,
    };
  }, [value, requestSnapshot, validationFn]);
}
