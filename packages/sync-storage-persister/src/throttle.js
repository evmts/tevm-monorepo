/**
 * @internal
 * A simple throttle function
 * @type {import('./ThrottleFn.ts').ThrottleFn}
 */
export const throttle = (func, wait = 100) => {
	/**
	 * @type {ReturnType<typeof setTimeout> | null}
	 */
	let timer = null
	/**
	 * @type {Array<any>}
	 */
	let params
	/**
	 * @type {((...args: any[]) => void) & { cancel?: () => void }}
	 */
	const throttledFn = (...args) => {
		// set the latest args
		params = args
		if (timer === null) {
			// wait til wait time after first call to run the function
			timer = setTimeout(() => {
				const f = /** @type {any}*/ (func)
				const res = f(...params)
				timer = null
				return res
			}, wait)
		}
	}
	throttledFn.cancel = () => {
		if (timer !== null) {
			clearTimeout(timer)
			timer = null
		}
	}
	return /** @type any*/ (throttledFn)
}
