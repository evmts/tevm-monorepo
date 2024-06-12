import type { Hex } from '../common/index.js'

// anvil_impersonateAccount
export type AnvilImpersonateAccountResult = null
// anvil_stopImpersonatingAccount
export type AnvilStopImpersonatingAccountResult = null
// anvil_autoImpersonateAccount
// We don't include this one because tevm_call supports it and i was getting methodNotFound errors in anvil
// export type AnvilAutoImpersonateAccountResult = null
// anvil_getAutomine
export type AnvilGetAutomineResult = boolean
// anvil_mine
export type AnvilMineResult = null
// anvil_reset
export type AnvilResetResult = null
// anvil_dropTransaction
export type AnvilDropTransactionResult = null
// anvil_setBalance
export type AnvilSetBalanceResult = null
// anvil_setCode
export type AnvilSetCodeResult = null
// anvil_setNonce
export type AnvilSetNonceResult = null
// anvil_setStorageAt
export type AnvilSetStorageAtResult = null
// anvil_setChainId
export type AnvilSetChainIdResult = null
// TODO make this the same as our dump state
// anvil_dumpState
export type AnvilDumpStateResult = Hex
// TODO make this the same as our load state
// anvil_loadState tf
export type AnvilLoadStateResult = null
