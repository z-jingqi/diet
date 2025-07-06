import { useRef, useEffect } from "react";
import debounce from "lodash/debounce";
import type { DebouncedFunc } from "lodash";

// Generic debounce hook that debounces a callback function.
// Usage:
//   const onChangeDebounced = useDebouncedCallback(handleChange, 500);
//   <input onChange={(e) => onChangeDebounced(e.target.value)} />
export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
  options?: Parameters<typeof debounce>[2]
): DebouncedFunc<T> {
  const fnRef = useRef(fn);

  // Keep latest fn in ref
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debouncedRef = useRef(
    debounce((...args: Parameters<T>) => fnRef.current(...args), delay, options)
  );

  // Cancel on unmount
  useEffect(() => {
    return () => {
      debouncedRef.current.cancel();
    };
  }, []);

  return debouncedRef.current;
}
