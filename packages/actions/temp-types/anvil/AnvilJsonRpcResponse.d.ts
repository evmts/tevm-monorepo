import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { Address } from '@tevm/utils';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { AnvilDealResult, AnvilDropTransactionResult, AnvilDumpStateResult, AnvilGetAutomineResult, AnvilImpersonateAccountResult, AnvilLoadStateResult, AnvilMineResult, AnvilResetResult, AnvilSetBalanceResult, AnvilSetChainIdResult, AnvilSetCodeResult, AnvilSetNonceResult, AnvilSetStorageAtResult, AnvilStopImpersonatingAccountResult } from './index.js';
type AnvilError = string;
/**
 * JSON-RPC response for `anvil_impersonateAccount` procedure
 */
export type AnvilImpersonateAccountJsonRpcResponse = JsonRpcResponse<'anvil_impersonateAccount', SerializeToJson<AnvilImpersonateAccountResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_stopImpersonatingAccount` procedure
 */
export type AnvilStopImpersonatingAccountJsonRpcResponse = JsonRpcResponse<'anvil_stopImpersonatingAccount', SerializeToJson<AnvilStopImpersonatingAccountResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setCoinbase` procedure
 */
export type AnvilSetCoinbaseJsonRpcResponse = JsonRpcResponse<'anvil_setCoinbase', Address, AnvilError>;
/**
 * JSON-RPC response for `anvil_autoImpersonateAccount` procedure
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
/**
 * JSON-RPC response for `anvil_getAutomine` procedure
 */
export type AnvilGetAutomineJsonRpcResponse = JsonRpcResponse<'anvil_getAutomine', SerializeToJson<AnvilGetAutomineResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_mine` procedure
 */
export type AnvilMineJsonRpcResponse = JsonRpcResponse<'anvil_mine', SerializeToJson<AnvilMineResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_reset` procedure
 */
export type AnvilResetJsonRpcResponse = JsonRpcResponse<'anvil_reset', SerializeToJson<AnvilResetResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_dropTransaction` procedure
 */
export type AnvilDropTransactionJsonRpcResponse = JsonRpcResponse<'anvil_dropTransaction', SerializeToJson<AnvilDropTransactionResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setBalance` procedure
 */
export type AnvilSetBalanceJsonRpcResponse = JsonRpcResponse<'anvil_setBalance', SerializeToJson<AnvilSetBalanceResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setCode` procedure
 */
export type AnvilSetCodeJsonRpcResponse = JsonRpcResponse<'anvil_setCode', SerializeToJson<AnvilSetCodeResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setNonce` procedure
 */
export type AnvilSetNonceJsonRpcResponse = JsonRpcResponse<'anvil_setNonce', SerializeToJson<AnvilSetNonceResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setStorageAt` procedure
 */
export type AnvilSetStorageAtJsonRpcResponse = JsonRpcResponse<'anvil_setStorageAt', SerializeToJson<AnvilSetStorageAtResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_setChainId` procedure
 */
export type AnvilSetChainIdJsonRpcResponse = JsonRpcResponse<'anvil_setChainId', SerializeToJson<AnvilSetChainIdResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_dumpState` procedure
 */
export type AnvilDumpStateJsonRpcResponse = JsonRpcResponse<'anvil_dumpState', SerializeToJson<AnvilDumpStateResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_loadState` procedure
 */
export type AnvilLoadStateJsonRpcResponse = JsonRpcResponse<'anvil_loadState', SerializeToJson<AnvilLoadStateResult>, AnvilError>;
/**
 * JSON-RPC response for `anvil_deal` procedure
 */
export type AnvilDealJsonRpcResponse = JsonRpcResponse<'anvil_deal', SerializeToJson<AnvilDealResult>, AnvilError>;
export {};
//# sourceMappingURL=AnvilJsonRpcResponse.d.ts.map