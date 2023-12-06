import { RunContractCallActionValidator, Tevm } from '@tevm/vm'

import type { Trpc } from '../Trpc.js'
import { Route } from './Route.js'

export class RunContractCallRoute extends Route {
	constructor(trpc: Trpc, protected readonly vm: Tevm) {
		super(trpc)
	}
	public readonly name = 'runContractCall'
	public readonly handler = this.trpc.procedure
		.meta({
			description: 'Execute a contract call on the vm',
		})
		.input(RunContractCallActionValidator)
		.query(async (req) => {
			return this.vm.runContractCall(req.input as any)
		})
}
