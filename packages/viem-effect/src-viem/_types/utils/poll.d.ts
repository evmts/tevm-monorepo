type PollOptions<TData> = {
	emitOnBegin?: boolean
	initialWaitTime?: (data: TData | void) => Promise<number>
	interval: number
}
/**
 * @description Polls a function at a specified interval.
 */
export declare function poll<TData>(
	fn: ({
		unpoll,
	}: {
		unpoll: () => void
	}) => Promise<TData | void>,
	{ emitOnBegin, initialWaitTime, interval }: PollOptions<TData>,
): () => boolean
export {}
//# sourceMappingURL=poll.d.ts.map
