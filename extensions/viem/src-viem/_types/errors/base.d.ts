type BaseErrorParameters = {
	docsPath?: string
	docsSlug?: string
	metaMessages?: string[]
} & (
	| {
			cause?: never
			details?: string
	  }
	| {
			cause: BaseError | Error
			details?: never
	  }
)
export declare class BaseError extends Error {
	details: string
	docsPath?: string
	metaMessages?: string[]
	shortMessage: string
	name: string
	version: string
	constructor(shortMessage: string, args?: BaseErrorParameters)
	walk(): Error
	walk(fn: (err: unknown) => boolean): Error | null
}
export {}
//# sourceMappingURL=base.d.ts.map
