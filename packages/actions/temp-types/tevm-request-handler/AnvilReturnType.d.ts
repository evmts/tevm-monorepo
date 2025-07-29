import type { AnvilDealJsonRpcResponse, AnvilDropTransactionJsonRpcResponse, AnvilDumpStateJsonRpcResponse, AnvilGetAutomineJsonRpcResponse, AnvilImpersonateAccountJsonRpcResponse, AnvilLoadStateJsonRpcResponse, AnvilMineJsonRpcResponse, AnvilResetJsonRpcResponse, AnvilSetBalanceJsonRpcResponse, AnvilSetChainIdJsonRpcResponse, AnvilSetCodeJsonRpcResponse, AnvilSetCoinbaseJsonRpcResponse, AnvilSetNonceJsonRpcResponse, AnvilSetStorageAtJsonRpcResponse, AnvilStopImpersonatingAccountJsonRpcResponse } from '../anvil/index.js';
/**
 * A mapping of `anvil_*` method names to their return type
 */
export type AnvilReturnType = {
    anvil_impersonateAccount: AnvilImpersonateAccountJsonRpcResponse;
    anvil_stopImpersonatingAccount: AnvilStopImpersonatingAccountJsonRpcResponse;
    anvil_getAutomine: AnvilGetAutomineJsonRpcResponse;
    anvil_mine: AnvilMineJsonRpcResponse;
    anvil_reset: AnvilResetJsonRpcResponse;
    anvil_dropTransaction: AnvilDropTransactionJsonRpcResponse;
    anvil_setBalance: AnvilSetBalanceJsonRpcResponse;
    anvil_setCode: AnvilSetCodeJsonRpcResponse;
    anvil_setNonce: AnvilSetNonceJsonRpcResponse;
    anvil_setStorageAt: AnvilSetStorageAtJsonRpcResponse;
    anvil_setChainId: AnvilSetChainIdJsonRpcResponse;
    anvil_dumpState: AnvilDumpStateJsonRpcResponse;
    anvil_loadState: AnvilLoadStateJsonRpcResponse;
    anvil_setCoinbase: AnvilSetCoinbaseJsonRpcResponse;
    anvil_deal: AnvilDealJsonRpcResponse;
};
//# sourceMappingURL=AnvilReturnType.d.ts.map