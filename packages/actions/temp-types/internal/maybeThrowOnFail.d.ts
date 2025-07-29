export function maybeThrowOnFail<TResult extends {
    errors?: any[];
}>(throwOnFail: boolean, result: TResult): TResult extends {
    throwOnError: true;
} ? Omit<TResult, "errors"> : TResult;
//# sourceMappingURL=maybeThrowOnFail.d.ts.map