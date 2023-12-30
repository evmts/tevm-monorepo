import { BaseError } from './base.js'
export class FilterTypeNotSupportedError extends BaseError {
	constructor(type) {
		super(`Filter type "${type}" is not supported.`)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'FilterTypeNotSupportedError',
		})
	}
}
//# sourceMappingURL=log.js.map
