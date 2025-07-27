import { useState, useCallback, useRef, useEffect } from "react";
import { UserByUsernameDocument } from "@/lib/gql/graphql";
import useDebouncedCallback from "./useDebouncedCallback";
import { GRAPHQL_ENDPOINT } from "@/lib/gql/client";

export const useUsernameValidation = () => {
  const [username, setUsername] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // debounced setter for username
  const debouncedSetUsername = useDebouncedCallback((val: string) => {
    setUsername(val);
  }, 500);

  // whenever username changes, fire validation
  const runValidation = useCallback(async (value: string) => {
    // cancel previous request if still in-flight
    abortRef.current?.abort();

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setIsAvailable(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setIsValidating(true);
    setError(null);

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: UserByUsernameDocument,
          variables: { username: trimmed },
        }),
        signal: controller.signal,
      });

      const json = await res.json();
      const user = json?.data?.userByUsername as
        | { id: string }
        | null
        | undefined;
      setIsAvailable(user ? false : true);
    } catch (err) {
      if ((err as any).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "检查用户名失败");
        setIsAvailable(null);
      }
    } finally {
      setIsValidating(false);
    }
  }, []);

  // trigger validation when username state updates (after debounce)
  useEffect(() => {
    runValidation(username);
  }, [username, runValidation]);

  const validateUsername = useCallback(
    (val: string) => {
      debouncedSetUsername(val);
    },
    [debouncedSetUsername],
  );

  const resetValidation = useCallback(() => {
    abortRef.current?.abort();
    debouncedSetUsername.cancel();
    setUsername("");
    setIsAvailable(null);
    setError(null);
  }, [debouncedSetUsername]);

  return {
    isValidating,
    isAvailable,
    error,
    validateUsername,
    resetValidation,
  };
};
