export function wrapWithEffect<T extends object>(instance: T, methods: (keyof T)[]): T & {
    effect: Record<string, (...args: unknown[]) => Effect.Effect<unknown, unknown, never>>;
};
import { Effect } from 'effect';
//# sourceMappingURL=wrapWithEffect.d.ts.map