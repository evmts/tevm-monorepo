---
title: JSON-RPC
description: JSON Remote Procedure Calls
---

## JSON-RPC Requests

All [clients](./clients.md) implement a [`tevm.request()`](../reference/@tevm/procedures-types/type-aliases/TevmJsonRpcRequestHandler.md) method for handling JSON-RPC requests.

```typescript
const {result, errors, id, method, jsonrpc} = await client.request({
 method: 'eth_blockNumber',
 params: [],
 id: 1,
 jsonrpc: '2.0',
})
```

Below are all procedures implemented or planned to be implemented. 🚧 means the procedure is still under construction

## Tevm methods

Tevm methods are feature-rich methods that provide a high level of control over the VM.

- [`tevm_call`](../reference/@tevm/procedures-types/type-aliases/CallJsonRpcProcedure.md) - Similar to eth call but with additional properties to control the VM execution
- [`tevm_getAccount`](../reference/@tevm/procedures-types/type-aliases/GetAccountJsonRpcProcedure.md) - gets account information such as balances contract information nonces and state roots.
- [`tevm_setAccount`](../reference/@tevm/procedures-types/type-aliases/SetAccountJsonRpcProcedure.md) - directly modifies the state of an account
- [`tevm_script`](../reference/@tevm/procedures-types/type-aliases/ScriptJsonRpcProcedure.md) - Runs the provided bytecode against the EVM state
- 🚧 [`tevm_traceContractCall`](../reference/@tevm/procedures-types/type-aliases/TraceContractCallJsonRpcProcedure.md) 
- 🚧 [`tevm_traceScript`](../reference/@tevm/procedures-types/type-aliases/TraceScriptJsonRpcProcedure.md) 
- [`tevm_dumpState`](../reference/@tevm/procedures-types/type-aliases/DumpStateJsonRpcProcedure.md) - Returns the state of the VM
- [`tevm_loadState`](../reference/@tevm/procedures-types/type-aliases/LoadStateJsonRpcProcedure.md) - Initializes the state of the VM

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`eth_chainId'](../reference/@tevm/procedures-types/type-aliases/EthChainIdJsonRpcProcedure.md)
- [`eth_call'](../reference/@tevm/procedures-types/type-aliases/EthCallJsonRpcProcedure.md)
- [`eth_getCode'](../reference/@tevm/procedures-types/type-aliases/EthGetCodeJsonRpcProcedure.md)
- [`eth_getStorageAt'](../reference/@tevm/procedures-types/type-aliases/EthGetCodeJsonRpcProcedure.md)
- [`eth_gasPrice'](../reference/@tevm/procedures-types/type-aliases/EthGasPriceJsonRpcProcedure.md)
- [`eth_getBalance'](../reference/@tevm/procedures-types/type-aliases/EthGetBalanceJsonRpcProcedure.md)
- [`eth_estimateGas'](../reference/@tevm/procedures-types/type-aliases/EthEstimateGasJsonRpcProcedure.md)
- 🚧 [`eth_sign'](../reference/@tevm/procedures-types/type-aliases/EthSignProcedure.md)
- 🚧 [`eth_getLogs'](../reference/@tevm/procedures-types/type-aliases/EthGetLogsJsonRpcProcedure.md)
- 🚧 [`eth_accounts'](../reference/@tevm/procedures-types/type-aliases/EthAccountsJsonRpcProcedure.md)
- 🚧 [`eth_coinbase'](../reference/@tevm/procedures-types/type-aliases/EthCoinbaseJsonRpcProcedure.md)
- 🚧 [`eth_hashrate'](../reference/@tevm/procedures-types/type-aliases/EthHashRateJsonRpcProcedure.md)
- 🚧 [`eth_newFilter'](../reference/@tevm/procedures-types/type-aliases/EthNewFilterJsonRpcProcedure.md)
- 🚧 [`eth_getFilterLogs'](../reference/@tevm/procedures-types/type-aliases/EthGetFilterLogsJsonRpcProcedure.md)
- 🚧 [`eth_getBlockByHash'](../reference/@tevm/procedures-types/type-aliases/EthGetBlockByHashJsonRpcProcedure.md)
- 🚧 [`eth_newBlockFilter'](../reference/@tevm/procedures-types/type-aliases/EthNewBlockFilterJsonRpcProcedure.md)
- 🚧 [`eth_protocolVersion'](../reference/@tevm/procedures-types/type-aliases/EthProtocolVersionJsonRpcProcedure.md)
- 🚧 [`eth_sendTransaction'](../reference/@tevm/procedures-types/type-aliases/EthSendTransactionJsonRpcProcedure.md)
- 🚧 [`eth_signTransaction'](../reference/@tevm/procedures-types/type-aliases/EthSignTransactionJsonRpcProcedure.md)
- 🚧 [`eth_uninstallFilter'](../reference/@tevm/procedures-types/type-aliases/EthUninstallFilterJsonRpcProcedure.md)
- 🚧 [`eth_getBlockByNumber'](../reference/@tevm/procedures-types/type-aliases/EthGetBlockByNumberJsonRpcProcedure.md)
- 🚧 [`eth_getFilterChanges'](../reference/@tevm/procedures-types/type-aliases/EthGetFilterChangesJsonRpcProcedure.md)
- 🚧 [`eth_sendRawTransaction'](../reference/@tevm/procedures-types/type-aliases/EthSendRawTransactionJsonRpcProcedure.md)
- 🚧 [`eth_getTransactionCount'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionCountJsonRpcProcedure.md)
- 🚧 [`eth_getTransactionByHash'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionByHashJsonRpcProcedure.md)
- 🚧 [`eth_getTransactionReceipt'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionReceiptJsonRpcProcedure.md)
- 🚧 [`eth_newPendingTransactionFilter'](../reference/@tevm/procedures-types/type-aliases/EthNewPendingTransactionFilterJsonRpcResponse.md)
- 🚧 [`eth_getBlockTransactionCountByHash'](../reference/@tevm/procedures-types/type-aliases/EthGetBlockTransactionCountByHashJsonRpcProcedure.md)
- 🚧 [`eth_getBlockTransactionCountByNumber'](../reference/@tevm/procedures-types/type-aliases/eth_getBlockTransactionCountByNumber.md)
- 🚧 [`eth_getTransactionByBlockHashAndIndex'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionByBlockHashAndIndexJsonRpcProcedure.md)
- 🚧 [`eth_getTransactionByBlockNumberAndIndex'](../reference/@tevm/procedures-types/type-aliases/EthTransactionByBlockNumberAndIndexJsonRpcProcedure.md)

## Debug methods

- 🚧 [`debug_traceTransaction`](../reference/@tevm/procedures-types/type-aliases/DebugTraceTransactionProcedure.md)
- 🚧 [`debug_traceCall`](../reference/@tevm/procedures-types/type-aliases/DebugTraceCallProcedure.md)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`anvil_mine'](../reference/@tevm/procedures-types/type-aliases/AnvilMineProcedure.md)
- 🚧 [`anvil_reset'](../reference/@tevm/procedures-types/type-aliases/AnvilResetProcedure.md)
- 🚧 [`anvil_setCode'](../reference/@tevm/procedures-types/type-aliases/AnvilSetCodeProcedure.md)
- 🚧 [`anvil_setNonce'](../reference/@tevm/procedures-types/type-aliases/AnvilSetNonceProcedure.md)
- 🚧 [`anvil_dumpState'](../reference/@tevm/procedures-types/type-aliases/AnvilDumpStateProcedure.md)
- 🚧 [`anvil_loadState'](../reference/@tevm/procedures-types/type-aliases/AnvilLoadStateProcedure.md)
- 🚧 [`anvil_setBalance'](../reference/@tevm/procedures-types/type-aliases/AnvilSetBalanceProcedure.md)
- 🚧 [`anvil_setChainId'](../reference/@tevm/procedures-types/type-aliases/AnvilSetChainIdProcedure.md)
- 🚧 [`anvil_getAutomine'](../reference/@tevm/procedures-types/type-aliases/AnvilGetAutomineProcedure.md)
- 🚧 [`anvil_setStorageAt'](../reference/@tevm/procedures-types/type-aliases/AnvilSetStorageAtProcedure.md)
- 🚧 [`anvil_dropTransaction'](../reference/@tevm/procedures-types/type-aliases/AnvilDropTransactionProcedure.md)
- 🚧 [`anvil_impersonateAccount'](../reference/@tevm/procedures-types/type-aliases/AnvilImpersonateAccountProcedure.md)
- 🚧 [`anvil_stopImpersonatingAccount'](../reference/@tevm/procedures-types/type-aliases/AnvilStopImpersonatingAccountProcedure.md)
