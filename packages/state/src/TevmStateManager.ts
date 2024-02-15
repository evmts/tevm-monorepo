import {
	ForkStateManager,
	type ForkStateManagerOpts,
} from './ForkStateManager.js'
import { NormalStateManager } from './NormalStateManager.js'
import {
	ProxyStateManager,
	type ProxyStateManagerOpts,
} from './ProxyStateManager.js'

export type TevmStateManager =
	| NormalStateManager
	| ForkStateManager
	| ProxyStateManager

export type TevmStateManagerOptions =
	| { fork: ForkStateManagerOpts }
	| { proxy: ProxyStateManagerOpts }
	| {}

export const createTevmStateManager = (options: TevmStateManagerOptions) => {
	if ('fork' in options && options.fork) {
		return new ForkStateManager(options.fork)
	}
	if ('proxy' in options && options.proxy) {
		return new ProxyStateManager(options.proxy)
	}
	return new NormalStateManager()
}
