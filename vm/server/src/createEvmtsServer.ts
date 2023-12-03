import { Trpc } from './Trpc.js'
import { TrpcApi } from './TrpcApi.js'
import {
	CallRoute,
	PutAccountRoute,
	PutContractCodeRoute,
	RunContractCallRoute,
	RunScriptRoute,
} from './routes/index.js'
import { EVMts } from '@evmts/vm'

export const createEvmtsServer = (vm: EVMts): TrpcApi => {
	const trpc = new Trpc()
	return new TrpcApi(
		trpc,
		new CallRoute(trpc, vm),
		new PutAccountRoute(trpc, vm),
		new PutContractCodeRoute(trpc, vm),
		new RunContractCallRoute(trpc, vm),
		new RunScriptRoute(trpc, vm),
	)
}
