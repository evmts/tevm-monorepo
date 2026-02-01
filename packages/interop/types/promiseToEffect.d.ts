export function promiseToEffect<A, Args extends readonly any[]>(fn: (...args: Args) => Promise<A>): (...args: Args) => Effect.Effect<A, unknown, never>;
import { Effect } from 'effect';
//# sourceMappingURL=promiseToEffect.d.ts.map