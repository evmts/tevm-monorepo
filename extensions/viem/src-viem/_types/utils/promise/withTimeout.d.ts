export declare function withTimeout<TData>(
	fn: ({
		signal,
	}: {
		signal?: AbortController['signal']
	}) => Promise<TData>,
	{
		errorInstance,
		timeout,
		signal,
	}: {
		errorInstance: Error
		timeout: number
		signal?: boolean
	},
): Promise<TData>
//# sourceMappingURL=withTimeout.d.ts.map
