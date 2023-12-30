export declare const promiseCache: Map<any, any>
export declare const responseCache: Map<any, any>
export declare function getCache<TData>(
	cacheKey: string,
): {
	clear: () => void
	promise: {
		clear: () => boolean
		get: () => Promise<TData> | undefined
		set: (data: Promise<TData>) => Map<string, Promise<TData>>
	}
	response: {
		clear: () => boolean
		get: () =>
			| {
					created: Date
					data: TData
			  }
			| undefined
		set: (data: {
			created: Date
			data: TData
		}) => Map<
			string,
			{
				created: Date
				data: TData
			}
		>
	}
}
export type WithCacheParameters = {
	/** The key to cache the data against. */
	cacheKey: string
	/** The time that cached data will remain in memory. Default: Infinity (no expiry) */
	cacheTime?: number
}
/**
 * @description Returns the result of a given promise, and caches the result for
 * subsequent invocations against a provided cache key.
 */
export declare function withCache<TData>(
	fn: () => Promise<TData>,
	{ cacheKey, cacheTime }: WithCacheParameters,
): Promise<TData>
//# sourceMappingURL=withCache.d.ts.map
