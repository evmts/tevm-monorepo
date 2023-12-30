type Resolved<TReturnType extends readonly unknown[] = any> = [
	result: TReturnType[number],
	results: TReturnType,
]
export type CreateBatchSchedulerArguments<
	TParameters = unknown,
	TReturnType extends readonly unknown[] = readonly unknown[],
> = {
	fn: (args: TParameters[]) => Promise<TReturnType>
	id: number | string
	shouldSplitBatch?: (args: TParameters[]) => boolean
	wait?: number
}
export type CreateBatchSchedulerReturnType<
	TParameters = unknown,
	TReturnType extends readonly unknown[] = readonly unknown[],
> = {
	flush: () => void
	schedule: TParameters extends undefined
		? (args?: TParameters) => Promise<Resolved<TReturnType>>
		: (args: TParameters) => Promise<Resolved<TReturnType>>
}
export declare function createBatchScheduler<
	TParameters,
	TReturnType extends readonly unknown[],
>({
	fn,
	id,
	shouldSplitBatch,
	wait,
}: CreateBatchSchedulerArguments<
	TParameters,
	TReturnType
>): CreateBatchSchedulerReturnType<TParameters, TReturnType>
export {}
//# sourceMappingURL=createBatchScheduler.d.ts.map
