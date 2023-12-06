import { CallActionValidator, Tevm } from '@tevm/vm'

import type { Trpc } from '../Trpc.js'
import { Route } from './Route.js'

export class CallRoute extends Route {
	constructor(trpc: Trpc, protected readonly vm: Tevm) {
		super(trpc)
	}
	public readonly name = 'call'
	public readonly handler = this.trpc.procedure
		.meta({
			description: 'Execute a call on the vm',
		})
		.input(CallActionValidator)
		.query(async (req) => {
			return this.vm.runCall(req.input)
		})
}
