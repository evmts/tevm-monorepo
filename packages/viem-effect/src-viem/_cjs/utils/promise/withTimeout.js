'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.withTimeout = void 0
function withTimeout(fn, { errorInstance, timeout, signal }) {
	return new Promise((resolve, reject) => {
		;(async () => {
			let timeoutId
			try {
				const controller = new AbortController()
				if (timeout > 0) {
					timeoutId = setTimeout(() => {
						if (signal) {
							controller.abort()
						} else {
							reject(errorInstance)
						}
					}, timeout)
				}
				resolve(await fn({ signal: controller?.signal }))
			} catch (err) {
				if (err.name === 'AbortError') reject(errorInstance)
				reject(err)
			} finally {
				clearTimeout(timeoutId)
			}
		})()
	})
}
exports.withTimeout = withTimeout
//# sourceMappingURL=withTimeout.js.map
