import type { JsonRpcRequest } from '@tevm/jsonrpc';
import type { Address, Hex } from '@tevm/utils';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { AnvilDealParams } from './AnvilParams.js';
import type { AnvilDropTransactionParams, AnvilDumpStateParams, AnvilGetAutomineParams, AnvilLoadStateParams } from './index.js';
/**
 * JSON-RPC request for `anvil_impersonateAccount` method
 */
export type AnvilImpersonateAccountJsonRpcRequest = JsonRpcRequest<'anvil_impersonateAccount', readonly [Address]>;
/**
 * JSON-RPC request for `anvil_stopImpersonatingAccount` method
 */
export type AnvilStopImpersonatingAccountJsonRpcRequest = JsonRpcRequest<'anvil_stopImpersonatingAccount', readonly [Address]>;
/**
 * JSON-RPC request for `anvil_autoImpersonateAccount` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
/**
 * JSON-RPC request for `anvil_getAutomine` method
 */
export type AnvilGetAutomineJsonRpcRequest = JsonRpcRequest<'anvil_getAutomine', [
    SerializeToJson<AnvilGetAutomineParams>
]>;
/**
 * JSON-RPC request for `anvil_setCoinbase` method
 * Not included atm because tevm_call supports it and i was getting methodNotFound errors trying it in anvil
 */
export type AnvilSetCoinbaseJsonRpcRequest = JsonRpcRequest<'anvil_setCoinbase', readonly [Address]>;
/**
 * JSON-RPC request for `anvil_mine` method
 */
export type AnvilMineJsonRpcRequest = JsonRpcRequest<'anvil_mine', readonly [blockCount: Hex, interval: Hex]>;
/**
 * JSON-RPC request for `anvil_reset` method
 */
export type AnvilResetJsonRpcRequest = JsonRpcRequest<'anvil_reset', readonly []>;
/**
 * JSON-RPC request for `anvil_dropTransaction` method
 */
export type AnvilDropTransactionJsonRpcRequest = JsonRpcRequest<'anvil_dropTransaction', [
    SerializeToJson<AnvilDropTransactionParams>
]>;
/**
 * JSON-RPC request for `anvil_setBalance` method
 */
export type AnvilSetBalanceJsonRpcRequest = JsonRpcRequest<'anvil_setBalance', readonly [address: Address, balance: Hex]>;
/**
 * JSON-RPC request for `anvil_setCode` method
 */
export type AnvilSetCodeJsonRpcRequest = JsonRpcRequest<'anvil_setCode', readonly [account: Address, deployedBytecode: Hex]>;
/**
 * JSON-RPC request for `anvil_setNonce` method
 */
export type AnvilSetNonceJsonRpcRequest = JsonRpcRequest<'anvil_setNonce', readonly [address: Address, nonce: Hex]>;
/**
 * JSON-RPC request for `anvil_setStorageAt` method
 */
export type AnvilSetStorageAtJsonRpcRequest = JsonRpcRequest<'anvil_setStorageAt', [
    address: Address,
    slot: Hex,
    value: Hex
]>;
/**
 * JSON-RPC request for `anvil_setChainId` method
 */
export type AnvilSetChainIdJsonRpcRequest = JsonRpcRequest<'anvil_setChainId', readonly [Hex]>;
/**
 * JSON-RPC request for `anvil_dumpState` method
 */
export type AnvilDumpStateJsonRpcRequest = JsonRpcRequest<'anvil_dumpState', readonly [SerializeToJson<AnvilDumpStateParams>]>;
/**
 * JSON-RPC request for `anvil_loadState` method
 */
export type AnvilLoadStateJsonRpcRequest = JsonRpcRequest<'anvil_loadState', readonly [SerializeToJson<AnvilLoadStateParams>]>;
/**
 * JSON-RPC request for `anvil_deal` method
 */
export type AnvilDealJsonRpcRequest = JsonRpcRequest<'anvil_deal', [SerializeToJson<AnvilDealParams>]>;
export type AnvilJsonRpcRequest = AnvilImpersonateAccountJsonRpcRequest | AnvilStopImpersonatingAccountJsonRpcRequest | AnvilGetAutomineJsonRpcRequest | AnvilMineJsonRpcRequest | AnvilResetJsonRpcRequest | AnvilDropTransactionJsonRpcRequest | AnvilSetBalanceJsonRpcRequest | AnvilSetCodeJsonRpcRequest | AnvilSetNonceJsonRpcRequest | AnvilSetStorageAtJsonRpcRequest | AnvilSetChainIdJsonRpcRequest | AnvilDumpStateJsonRpcRequest | AnvilLoadStateJsonRpcRequest | AnvilSetCoinbaseJsonRpcRequest | AnvilDealJsonRpcRequest;
//# sourceMappingURL=AnvilJsonRpcRequest.d.ts.map