import type {
	CallHandler,
	ContractHandler,
	DumpStateHandler,
	LoadStateHandler,
	ScriptHandler,
	SetAccountHandler,
} from '@tevm/actions-types'
import type { GetAccountHandler } from '../../../packages/actions-types/dist/index.cjs'

/**
 * The decorated properties added by the `tevmViemExtension`
 */
export type ViemTevmClient = {
	tevm: {
		call: CallHandler
		contract: ContractHandler
		script: ScriptHandler
		setAccount: SetAccountHandler
		getAccount: GetAccountHandler
		dumpState: DumpStateHandler
		loadState: LoadStateHandler
	}
}
