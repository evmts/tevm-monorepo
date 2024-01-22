import { getVersion } from './utils.js'
export class BaseError extends Error {
	constructor(shortMessage, args = {}) {
		super()
		Object.defineProperty(this, 'details', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'docsPath', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'metaMessages', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'shortMessage', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ViemError',
		})
		Object.defineProperty(this, 'version', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: getVersion(),
		})
		const details =
			args.cause instanceof BaseError
				? args.cause.details
				: args.cause?.message
				? args.cause.message
				: args.details
		const docsPath =
			args.cause instanceof BaseError
				? args.cause.docsPath || args.docsPath
				: args.docsPath
		this.message = [
			shortMessage || 'An error occurred.',
			'',
			...(args.metaMessages ? [...args.metaMessages, ''] : []),
			...(docsPath
				? [
						`Docs: https://viem.sh${docsPath}.html${
							args.docsSlug ? `#${args.docsSlug}` : ''
						}`,
				  ]
				: []),
			...(details ? [`Details: ${details}`] : []),
			`Version: ${this.version}`,
		].join('\n')
		if (args.cause) this.cause = args.cause
		this.details = details
		this.docsPath = docsPath
		this.metaMessages = args.metaMessages
		this.shortMessage = shortMessage
	}
	walk(fn) {
		return walk(this, fn)
	}
}
function walk(err, fn) {
	if (fn?.(err)) return err
	if (err && typeof err === 'object' && 'cause' in err)
		return walk(err.cause, fn)
	return fn ? null : err
}
//# sourceMappingURL=base.js.map
