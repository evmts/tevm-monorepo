import type {
	AnvilAddBalanceParams,
	AnvilDealErc20Params,
	AnvilDealParams,
	AnvilDropTransactionParams,
	AnvilDumpStateParams,
	AnvilGetAutomineParams,
	AnvilImpersonateAccountParams,
	AnvilLoadStateParams,
	AnvilMetadataParams,
	AnvilMineParams,
	AnvilNodeInfoParams,
	AnvilResetParams,
	AnvilSetBalanceParams,
	AnvilSetChainIdParams,
	AnvilSetCodeParams,
	AnvilSetErc20AllowanceParams,
	AnvilSetLoggingEnabledParams,
	AnvilSetNonceParams,
	AnvilSetRpcUrlParams,
	AnvilSetStorageAtParams,
	AnvilStopImpersonatingAccountParams,
} from './AnvilParams.js'
import type {
	AnvilAddBalanceResult,
	AnvilDealErc20Result,
	AnvilDealResult,
	AnvilDropTransactionResult,
	AnvilDumpStateResult,
	AnvilGetAutomineResult,
	AnvilImpersonateAccountResult,
	AnvilLoadStateResult,
	AnvilMetadataResult,
	AnvilMineResult,
	AnvilNodeInfoResult,
	AnvilResetResult,
	AnvilSetBalanceResult,
	AnvilSetChainIdResult,
	AnvilSetCodeResult,
	AnvilSetErc20AllowanceResult,
	AnvilSetLoggingEnabledResult,
	AnvilSetNonceResult,
	AnvilSetRpcUrlResult,
	AnvilSetStorageAtResult,
	AnvilStopImpersonatingAccountResult,
} from './AnvilResult.js'

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
export type AnvilGetAutomineHandler = (params: AnvilGetAutomineParams) => Promise<AnvilGetAutomineResult>
// anvil_mine
export type AnvilMineHandler = (params: AnvilMineParams) => Promise<AnvilMineResult>
// anvil_reset
export type AnvilResetHandler = (params: AnvilResetParams) => Promise<AnvilResetResult>
// anvil_dropTransaction
export type AnvilDropTransactionHandler = (params: AnvilDropTransactionParams) => Promise<AnvilDropTransactionResult>
// anvil_setBalance
export type AnvilSetBalanceHandler = (params: AnvilSetBalanceParams) => Promise<AnvilSetBalanceResult>
// anvil_setCode
export type AnvilSetCodeHandler = (params: AnvilSetCodeParams) => Promise<AnvilSetCodeResult>
// anvil_setNonce
export type AnvilSetNonceHandler = (params: AnvilSetNonceParams) => Promise<AnvilSetNonceResult>
// anvil_setStorageAt
export type AnvilSetStorageAtHandler = (params: AnvilSetStorageAtParams) => Promise<AnvilSetStorageAtResult>
// anvil_setChainId
export type AnvilSetChainIdHandler = (params: AnvilSetChainIdParams) => Promise<AnvilSetChainIdResult>
// TODO make this the same as our dump state
// anvil_dumpState
export type AnvilDumpStateHandler = (params: AnvilDumpStateParams) => Promise<AnvilDumpStateResult>
// TODO make this the same as our load state
// anvil_loadState
export type AnvilLoadStateHandler = (params: AnvilLoadStateParams) => Promise<AnvilLoadStateResult>
// anvil_deal
export type AnvilDealHandler = (params: AnvilDealParams) => Promise<AnvilDealResult>
// anvil_dealErc20
export type AnvilDealErc20Handler = (params: AnvilDealErc20Params) => Promise<AnvilDealErc20Result>
// anvil_setErc20Allowance
export type AnvilSetErc20AllowanceHandler = (
	params: AnvilSetErc20AllowanceParams,
) => Promise<AnvilSetErc20AllowanceResult>
// anvil_nodeInfo
export type AnvilNodeInfoHandler = (params: AnvilNodeInfoParams) => Promise<AnvilNodeInfoResult>
// anvil_metadata
export type AnvilMetadataHandler = (params: AnvilMetadataParams) => Promise<AnvilMetadataResult>
// anvil_setRpcUrl
export type AnvilSetRpcUrlHandler = (params: AnvilSetRpcUrlParams) => Promise<AnvilSetRpcUrlResult>
// anvil_setLoggingEnabled
export type AnvilSetLoggingEnabledHandler = (
	params: AnvilSetLoggingEnabledParams,
) => Promise<AnvilSetLoggingEnabledResult>
// anvil_addBalance
export type AnvilAddBalanceHandler = (params: AnvilAddBalanceParams) => Promise<AnvilAddBalanceResult>
