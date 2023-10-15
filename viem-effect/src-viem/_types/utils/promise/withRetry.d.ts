export declare function withRetry<TData>(fn: () => Promise<TData>, { delay: delay_, retryCount, shouldRetry, }?: {
    delay?: ((config: {
        count: number;
        error: Error;
    }) => number) | number;
    retryCount?: number;
    shouldRetry?: ({ count, error, }: {
        count: number;
        error: Error;
    }) => Promise<boolean> | boolean;
}): Promise<TData>;
//# sourceMappingURL=withRetry.d.ts.map