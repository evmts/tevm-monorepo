import { EVMts, RunContractCallActionValidator } from '@evmts/vm'

import type { Trpc } from '../Trpc.js'
import { Route } from './Route.js'

export class RunContractCallRoute extends Route {
	constructor(trpc: Trpc, protected readonly vm: EVMts) {
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
