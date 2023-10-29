export interface BaseStateOptions {
    persist: {
        name: string;
        version: number;
    } | undefined;
}
/**
 * The base class that other pieces of state extend from
 * I made this class based because it reduces the boilerplate
 * of using zustand with typescript a fair amount
 *
 * @see https://docs.pmnd.rs/zustand
 */
export declare abstract class BaseState<T extends {}> {
    private readonly _options;
    /**
     * Get latest zustand state
     */
    protected get: () => T;
    /**
     * Set zustand state.   Zustand will automatically
     * persist the other keys in the state.
     *
     * @see https://docs.pmnd.rs/zustand/guides/updating-state
     */
    protected set: (stateTransition: Partial<T> | ((state: T) => Partial<T>)) => void;
    constructor(_options?: BaseStateOptions);
    /**
     * @parameter enableDev
     * @returns zustand store
     */
    createStore: (enableDev?: boolean) => import("zustand").UseBoundStore<import("zustand").StoreApi<T>>;
}
//# sourceMappingURL=BaseState.d.ts.map