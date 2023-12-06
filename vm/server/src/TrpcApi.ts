import { Api } from './Api.js'
import type { Trpc } from './Trpc.js'
import type { PutContractCodeRoute } from './routes/PutContractCodeRoute.js'
import {
	CallRoute,
	PutAccountRoute,
	RunContractCallRoute,
	RunScriptRoute,
} from './routes/index.js'

export class TrpcApi extends Api {
	public readonly name = 'TevmJsonRPC'
	constructor(
		trpc: Trpc,
		callRoute: CallRoute,
		putAccountRoute: PutAccountRoute,
		putContractCodeRoute: PutContractCodeRoute,
		runContractCallRoute: RunContractCallRoute,
		runScriptRoute: RunScriptRoute,
		public readonly handler = trpc.router({
			[callRoute.name]: callRoute.handler,
			[putAccountRoute.name]: putAccountRoute.handler,
			[putContractCodeRoute.name]: putContractCodeRoute.handler,
			[runContractCallRoute.name]: runContractCallRoute.handler,
			[runScriptRoute.name]: runScriptRoute.handler,
		}),
	) {
		super(trpc)
	}
}
