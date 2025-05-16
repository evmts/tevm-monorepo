/**
 * Copied from @latticexyz/stash/react to use deepEqual instead of shallow equal and prevent infinite re-renders.
 * @see https://github.com/latticexyz/mud/blob/main/packages/stash/src/react/useStash.ts
 */
import { subscribeStash, type Stash, type State, type StoreConfig } from "@latticexyz/stash/internal";
import { useDebugValue, useSyncExternalStore } from "react";
import { isEqual } from "lodash";

export type UseStashOptions<T> = {
  /**
   * Optional equality function.
   * Must be a stable function, otherwise you may end up with this hook rerendering infinitely.
   * @default deepEqual (for objects/arrays), (a, b) => a === b (for primitives)
   */
  isEqual?: (a: T, b: T) => boolean;
};

export function useStash<config extends StoreConfig, T>(
  stash: Stash<config>,
  /**
   * Selector to pick values from state.
   * Be aware of the stability of both the `selector` and the return value, otherwise you may end up with unnecessary re-renders.
   */
  selector: (state: State<config>) => T,
  opts: UseStashOptions<T> = {},
): T {
  const slice = useSyncExternalStore(
    (subscriber) => subscribeStash({ stash, subscriber }),
    // Use the user-provided isEqual if available, otherwise default to our deepEqual
    memoize(() => selector(stash.get()), opts.isEqual ?? isEqual),
  );
  useDebugValue(slice);
  return slice;
}

function memoize<T>(fn: () => T, isEqual: (a: T, b: T) => boolean): () => T {
  let ref: { current: T } | null = null;
  return () => {
    const current = fn();
    if (ref == null) {
      ref = { current };
    } else if (!isEqual(ref.current, current)) {
      ref.current = current;
    }
    return ref.current;
  };
}