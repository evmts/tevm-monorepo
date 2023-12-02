import { EVMts, PutAccountActionValidator } from '@evmts/vm'

import type { Trpc } from '../Trpc.js'
import { Route } from './Route.js'

export class PutAccountRoute extends Route {
	constructor(trpc: Trpc, protected readonly vm: EVMts) {
		super(trpc)
	}
	public readonly name = 'putAccount'
	public readonly handler = this.trpc.procedure
		.meta({
			description: 'Put an account on the vm',
		})
		.input(PutAccountActionValidator)
		.query(async (req) => {
			return this.vm.putAccount(req.input)
		})
}
