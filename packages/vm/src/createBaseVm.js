import { EventEmitter } from "eventemitter3";

/**
 * @param {import('./VmOpts.js').VmOpts} opts
 * @returns {import('./BaseVm.js').BaseVm}
 */
export const createBaseVm = (opts) => {
	/**
	 * @type {import('./BaseVm.js').BaseVm['events']}
	 */
	const events = new EventEmitter();
	return {
		stateManager: opts.stateManager,
		evm: opts.evm,
		blockchain: opts.blockchain,
		common: opts.common,
		events,
		_emit: async (topic, data) => {
			console.log(topic, data);
			try {
				return new Promise((resolve, reject) => {
					try {
						if (!events.emit(topic, data, resolve)) {
							reject("Failed to emit");
						}
					} catch (e) {
						reject(e);
					}
				});
			} catch (e) {
				console.error(e);
			}
		},
		ready: async () => {
			await Promise.all([opts.blockchain.ready(), opts.stateManager.ready()]);
			return true;
		},
	};
};
