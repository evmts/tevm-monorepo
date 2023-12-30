'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.observe = exports.cleanupCache = exports.listenersCache = void 0
exports.listenersCache = new Map()
exports.cleanupCache = new Map()
let callbackCount = 0
function observe(observerId, callbacks, fn) {
	const callbackId = ++callbackCount
	const getListeners = () => exports.listenersCache.get(observerId) || []
	const unsubscribe = () => {
		const listeners = getListeners()
		exports.listenersCache.set(
			observerId,
			listeners.filter((cb) => cb.id !== callbackId),
		)
	}
	const unwatch = () => {
		const cleanup = exports.cleanupCache.get(observerId)
		if (getListeners().length === 1 && cleanup) cleanup()
		unsubscribe()
	}
	const listeners = getListeners()
	exports.listenersCache.set(observerId, [
		...listeners,
		{ id: callbackId, fns: callbacks },
	])
	if (listeners && listeners.length > 0) return unwatch
	const emit = {}
	for (const key in callbacks) {
		emit[key] = (...args) => {
			const listeners = getListeners()
			if (listeners.length === 0) return
			listeners.forEach((listener) => listener.fns[key]?.(...args))
		}
	}
	const cleanup = fn(emit)
	if (typeof cleanup === 'function')
		exports.cleanupCache.set(observerId, cleanup)
	return unwatch
}
exports.observe = observe
//# sourceMappingURL=observe.js.map
