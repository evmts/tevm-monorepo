import { EventEmitter } from 'eventemitter3'

/**
 * @param {import('./VmOpts.js').VmOpts} opts
 * @returns {import('./BaseVm.js').BaseVm}
 */
export const createBaseVm = (opts) => {
	/**
	 * @type {import('./BaseVm.js').BaseVm['events']}
	 */
	const events = new EventEmitter()
	return {
		stateManager: opts.stateManager,
		evm: opts.evm,
		blockchain: opts.blockchain,
		common: opts.common,
		events,
		_emit: async (topic, data) => {
			return new Promise((resolve, reject) => {
				try {
					// eventemitter3 invokes listeners synchronously. We pass `resolve` as the
					// optional 3rd arg so async-aware listeners may still call it, but we do NOT
					// depend on it being called: a normal listener like
					// `vm.events.on('afterTx', (event) => {...})` ignores the callback, and
					// relying on it would hang runTx/runBlock forever. Once the synchronous emit
					// returns, all listeners have run, so we resolve immediately (Promise resolve
					// is idempotent, so a listener that also called `resolve` is harmless).
					events.emit(topic, data, resolve)
					resolve()
				} catch (e) {
					// Propagate (do not swallow) errors thrown synchronously by a listener so the
					// caller of runTx/runBlock sees them rather than only a console.error.
					reject(e)
				}
			})
		},
		ready: async () => {
			await Promise.all([opts.blockchain.ready(), opts.stateManager.ready()])
			return true
		},
	}
}
