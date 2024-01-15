import type {
	AnvilDropTransactionParams,
	AnvilDumpStateParams,
	AnvilGetAutomineParams,
	AnvilImpersonateAccountParams,
	AnvilLoadStateParams,
	AnvilMineParams,
	AnvilResetParams,
	AnvilSetBalanceParams,
	AnvilSetChainIdParams,
	AnvilSetCodeParams,
	AnvilSetNonceParams,
	AnvilSetStorageAtParams,
	AnvilStopImpersonatingAccountParams,
} from '../params/index.js'
import type {
	AnvilDropTransactionResult,
	AnvilDumpStateResult,
	AnvilGetAutomineResult,
	AnvilImpersonateAccountResult,
	AnvilLoadStateResult,
	AnvilMineResult,
	AnvilResetResult,
	AnvilSetBalanceResult,
	AnvilSetChainIdResult,
	AnvilSetCodeResult,
	AnvilSetNonceResult,
	AnvilSetStorageAtResult,
	AnvilStopImpersonatingAccountResult,
} from '../result/AnvilResult.js'

// anvil_impersonateAccount
export type AnvilImpersonateAccountHandler = (
	params: AnvilImpersonateAccountParams,
) => Promise<AnvilImpersonateAccountResult>
// anvil_stopImpersonatingAccount
export type AnvilStopImpersonatingAccountHandler = (
	params: AnvilStopImpersonatingAccountParams,
) => Promise<AnvilStopImpersonatingAccountResult>
// anvil_autoImpersonateAccount
// We don't include this one because tevm_call supports it and i was getting methodNotFound errors in anvil
// export type AnvilAutoImpersonateAccountHandler = (params: AnvilAutoImpersonateAccountParams) => Promise<AnvilAutoImpersonateAccountResult>;
// anvil_getAutomine
export type AnvilGetAutomineHandler = (
	params: AnvilGetAutomineParams,
) => Promise<AnvilGetAutomineResult>
// anvil_mine
export type AnvilMineHandler = (
	params: AnvilMineParams,
) => Promise<AnvilMineResult>
// anvil_reset
export type AnvilResetHandler = (
	params: AnvilResetParams,
) => Promise<AnvilResetResult>
// anvil_dropTransaction
export type AnvilDropTransactionHandler = (
	params: AnvilDropTransactionParams,
) => Promise<AnvilDropTransactionResult>
// anvil_setBalance
export type AnvilSetBalanceHandler = (
	params: AnvilSetBalanceParams,
) => Promise<AnvilSetBalanceResult>
// anvil_setCode
export type AnvilSetCodeHandler = (
	params: AnvilSetCodeParams,
) => Promise<AnvilSetCodeResult>
// anvil_setNonce
export type AnvilSetNonceHandler = (
	params: AnvilSetNonceParams,
) => Promise<AnvilSetNonceResult>
// anvil_setStorageAt
export type AnvilSetStorageAtHandler = (
	params: AnvilSetStorageAtParams,
) => Promise<AnvilSetStorageAtResult>
// anvil_setChainId
export type AnvilSetChainIdHandler = (
	params: AnvilSetChainIdParams,
) => Promise<AnvilSetChainIdResult>
// TODO make this the same as our dump state
// anvil_dumpState
export type AnvilDumpStateHandler = (
	params: AnvilDumpStateParams,
) => Promise<AnvilDumpStateResult>
// TODO make this the same as our load state
// anvil_loadState
export type AnvilLoadStateHandler = (
	params: AnvilLoadStateParams,
) => Promise<AnvilLoadStateResult>
