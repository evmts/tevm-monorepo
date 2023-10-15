import type { MaybePromise } from '../types/utils.js';
type Callback = ((...args: any[]) => any) | undefined;
type Callbacks = Record<string, Callback>;
export declare const listenersCache: Map<string, {
    id: number;
    fns: Callbacks;
}[]>;
export declare const cleanupCache: Map<string, () => void>;
type EmitFunction<TCallbacks extends Callbacks> = (emit: TCallbacks) => MaybePromise<void | (() => void)>;
/**
 * @description Sets up an observer for a given function. If another function
 * is set up under the same observer id, the function will only be called once
 * for both instances of the observer.
 */
export declare function observe<TCallbacks extends Callbacks>(observerId: string, callbacks: TCallbacks, fn: EmitFunction<TCallbacks>): () => void;
export {};
//# sourceMappingURL=observe.d.ts.map