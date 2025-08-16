import type { AnvilDealJsonRpcRequest, AnvilDropTransactionJsonRpcRequest, AnvilDumpStateJsonRpcRequest, AnvilGetAutomineJsonRpcRequest, AnvilImpersonateAccountJsonRpcRequest, AnvilLoadStateJsonRpcRequest, AnvilMineJsonRpcRequest, AnvilResetJsonRpcRequest, AnvilSetBalanceJsonRpcRequest, AnvilSetChainIdJsonRpcRequest, AnvilSetCodeJsonRpcRequest, AnvilSetCoinbaseJsonRpcRequest, AnvilSetNonceJsonRpcRequest, AnvilSetStorageAtJsonRpcRequest, AnvilStopImpersonatingAccountJsonRpcRequest } from './AnvilJsonRpcRequest.js';
import type { AnvilDealJsonRpcResponse, AnvilDropTransactionJsonRpcResponse, AnvilDumpStateJsonRpcResponse, AnvilGetAutomineJsonRpcResponse, AnvilImpersonateAccountJsonRpcResponse, AnvilLoadStateJsonRpcResponse, AnvilMineJsonRpcResponse, AnvilResetJsonRpcResponse, AnvilSetBalanceJsonRpcResponse, AnvilSetChainIdJsonRpcResponse, AnvilSetCodeJsonRpcResponse, AnvilSetCoinbaseJsonRpcResponse, AnvilSetNonceJsonRpcResponse, AnvilSetStorageAtJsonRpcResponse, AnvilStopImpersonatingAccountJsonRpcResponse } from './AnvilJsonRpcResponse.js';
export type AnvilSetCoinbaseProcedure = (request: AnvilSetCoinbaseJsonRpcRequest) => Promise<AnvilSetCoinbaseJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_impersonateAccount`
 */
export type AnvilImpersonateAccountProcedure = (request: AnvilImpersonateAccountJsonRpcRequest) => Promise<AnvilImpersonateAccountJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_stopImpersonatingAccount`
 */
export type AnvilStopImpersonatingAccountProcedure = (request: AnvilStopImpersonatingAccountJsonRpcRequest) => Promise<AnvilStopImpersonatingAccountJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_autoImpersonateAccount`
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
/**
 * JSON-RPC procedure for `anvil_getAutomine`
 */
export type AnvilGetAutomineProcedure = (request: AnvilGetAutomineJsonRpcRequest) => Promise<AnvilGetAutomineJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_mine`
 */
export type AnvilMineProcedure = (request: AnvilMineJsonRpcRequest) => Promise<AnvilMineJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_reset`
 */
export type AnvilResetProcedure = (request: AnvilResetJsonRpcRequest) => Promise<AnvilResetJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_dropTransaction`
 */
export type AnvilDropTransactionProcedure = (request: AnvilDropTransactionJsonRpcRequest) => Promise<AnvilDropTransactionJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setBalance`
 */
export type AnvilSetBalanceProcedure = (request: AnvilSetBalanceJsonRpcRequest) => Promise<AnvilSetBalanceJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setCode`
 */
export type AnvilSetCodeProcedure = (request: AnvilSetCodeJsonRpcRequest) => Promise<AnvilSetCodeJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setNonce`
 */
export type AnvilSetNonceProcedure = (request: AnvilSetNonceJsonRpcRequest) => Promise<AnvilSetNonceJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setStorageAt`
 */
export type AnvilSetStorageAtProcedure = (request: AnvilSetStorageAtJsonRpcRequest) => Promise<AnvilSetStorageAtJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_setChainId`
 */
export type AnvilSetChainIdProcedure = (request: AnvilSetChainIdJsonRpcRequest) => Promise<AnvilSetChainIdJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_dumpState`
 */
export type AnvilDumpStateProcedure = (request: AnvilDumpStateJsonRpcRequest) => Promise<AnvilDumpStateJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_loadState`
 */
export type AnvilLoadStateProcedure = (request: AnvilLoadStateJsonRpcRequest) => Promise<AnvilLoadStateJsonRpcResponse>;
/**
 * JSON-RPC procedure for `anvil_deal`
 */
export type AnvilDealProcedure = (request: AnvilDealJsonRpcRequest) => Promise<AnvilDealJsonRpcResponse>;
export type AnvilProcedure = AnvilSetCoinbaseProcedure | AnvilImpersonateAccountProcedure | AnvilStopImpersonatingAccountProcedure | AnvilGetAutomineProcedure | AnvilMineProcedure | AnvilResetProcedure | AnvilDropTransactionProcedure | AnvilSetBalanceProcedure | AnvilSetCodeProcedure | AnvilSetNonceProcedure | AnvilSetStorageAtProcedure | AnvilSetChainIdProcedure | AnvilDumpStateProcedure | AnvilLoadStateProcedure | AnvilDealProcedure;
//# sourceMappingURL=AnvilProcedure.d.ts.map