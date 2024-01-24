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

## Tevm actions

Tevm methods are the main recomended way to interact with Tevm. 🚧 means the procedure is still under construction

- [`Tevm.call`](../reference/@tevm/procedures-types/type-aliases/CallJsonRpcProcedure.md) - Similar to eth call but with additional properties to control the VM execution
- [`Tevm.getAccount`](../reference/@tevm/procedures-types/type-aliases/GetAccountJsonRpcProcedure.md) - gets account information such as balances contract information nonces and state roots.
- [`Tevm.setAccount`](../reference/@tevm/procedures-types/type-aliases/SetAccountJsonRpcProcedure.md) - directly modifies the state of an account
- [`Tevm.contract`](../reference/@tevm/procedures-types/type-aliases/CallJsonRpcProcedure.md) - Similar to eth call but with additional properties to control the VM execution
- [`Tevm.script`](../reference/@tevm/procedures-types/type-aliases/ScriptJsonRpcProcedure.md) - Runs the provided bytecode against the EVM state
- 🚧 [`Tevm.traceContractCall`](../reference/@tevm/procedures-types/type-aliases/TraceContractCallJsonRpcProcedure.md) 
- 🚧 [`Tevm.traceScript`](../reference/@tevm/procedures-types/type-aliases/TraceScriptJsonRpcProcedure.md) 
- [`Tevm.dumpState`](../reference/@tevm/procedures-types/type-aliases/DumpStateJsonRpcProcedure.md) - Returns the state of the VM
- [`Tevm.loadState`](../reference/@tevm/procedures-types/type-aliases/LoadStateJsonRpcProcedure.md) - Initializes the state of the VM

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`Tevm.eth.chainId'](../reference/@tevm/procedures-types/type-aliases/EthChainIdJsonRpcProcedure.md)
- [`Tevm.eth.call'](../reference/@tevm/procedures-types/type-aliases/EthCallJsonRpcProcedure.md)
- [`Tevm.eth.getCode'](../reference/@tevm/procedures-types/type-aliases/EthGetCodeJsonRpcProcedure.md)
- [`Tevm.eth.getStorageAt'](../reference/@tevm/procedures-types/type-aliases/EthGetCodeJsonRpcProcedure.md)
- [`Tevm.eth.gasPrice'](../reference/@tevm/procedures-types/type-aliases/EthGasPriceJsonRpcProcedure.md)
- [`Tevm.eth.getBalance'](../reference/@tevm/procedures-types/type-aliases/EthGetBalanceJsonRpcProcedure.md)
- [`Tevm.eth.estimateGas'](../reference/@tevm/procedures-types/type-aliases/EthEstimateGasJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.sign'](../reference/@tevm/procedures-types/type-aliases/EthSignProcedure.md)
- 🚧 [`Tevm.eth.getLogs'](../reference/@tevm/procedures-types/type-aliases/EthGetLogsJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.accounts'](../reference/@tevm/procedures-types/type-aliases/EthAccountsJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.coinbase'](../reference/@tevm/procedures-types/type-aliases/EthCoinbaseJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.hashrate'](../reference/@tevm/procedures-types/type-aliases/EthHashRateJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.newFilter'](../reference/@tevm/procedures-types/type-aliases/EthNewFilterJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getFilterLogs'](../reference/@tevm/procedures-types/type-aliases/EthGetFilterLogsJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getBlockByHash'](../reference/@tevm/procedures-types/type-aliases/EthGetBlockByHashJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.newBlockFilter'](../reference/@tevm/procedures-types/type-aliases/EthNewBlockFilterJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.protocolVersion'](../reference/@tevm/procedures-types/type-aliases/EthProtocolVersionJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.sendTransaction'](../reference/@tevm/procedures-types/type-aliases/EthSendTransactionJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.signTransaction'](../reference/@tevm/procedures-types/type-aliases/EthSignTransactionJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.uninstallFilter'](../reference/@tevm/procedures-types/type-aliases/EthUninstallFilterJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getBlockByNumber'](../reference/@tevm/procedures-types/type-aliases/EthGetBlockByNumberJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getFilterChanges'](../reference/@tevm/procedures-types/type-aliases/EthGetFilterChangesJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.sendRawTransaction'](../reference/@tevm/procedures-types/type-aliases/EthSendRawTransactionJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getTransactionCount'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionCountJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getTransactionByHash'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionByHashJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getTransactionReceipt'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionReceiptJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.newPendingTransactionFilter'](../reference/@tevm/procedures-types/type-aliases/EthNewPendingTransactionFilterJsonRpcResponse.md)
- 🚧 [`Tevm.eth.getBlockTransactionCountByHash'](../reference/@tevm/procedures-types/type-aliases/EthGetBlockTransactionCountByHashJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getBlockTransactionCountByNumber'](../reference/@tevm/procedures-types/type-aliases/Tevm.eth.getBlockTransactionCountByNumber.md)
- 🚧 [`Tevm.eth.getTransactionByBlockHashAndIndex'](../reference/@tevm/procedures-types/type-aliases/EthGetTransactionByBlockHashAndIndexJsonRpcProcedure.md)
- 🚧 [`Tevm.eth.getTransactionByBlockNumberAndIndex'](../reference/@tevm/procedures-types/type-aliases/EthTransactionByBlockNumberAndIndexJsonRpcProcedure.md)

## Debug methods

- 🚧 [`Tevm.debug.traceTransaction`](../reference/@tevm/procedures-types/type-aliases/DebugTraceTransactionProcedure.md)
- 🚧 [`Tevm.debug.traceCall`](../reference/@tevm/procedures-types/type-aliases/DebugTraceCallProcedure.md)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`Tevm.anvil.mine'](../reference/@tevm/procedures-types/type-aliases/AnvilMineProcedure.md)
- 🚧 [`Tevm.anvil.reset'](../reference/@tevm/procedures-types/type-aliases/AnvilResetProcedure.md)
- 🚧 [`Tevm.anvil.setCode'](../reference/@tevm/procedures-types/type-aliases/AnvilSetCodeProcedure.md)
- 🚧 [`Tevm.anvil.setNonce'](../reference/@tevm/procedures-types/type-aliases/AnvilSetNonceProcedure.md)
- 🚧 [`Tevm.anvil.dumpState'](../reference/@tevm/procedures-types/type-aliases/AnvilDumpStateProcedure.md)
- 🚧 [`Tevm.anvil.loadState'](../reference/@tevm/procedures-types/type-aliases/AnvilLoadStateProcedure.md)
- 🚧 [`Tevm.anvil.setBalance'](../reference/@tevm/procedures-types/type-aliases/AnvilSetBalanceProcedure.md)
- 🚧 [`Tevm.anvil.setChainId'](../reference/@tevm/procedures-types/type-aliases/AnvilSetChainIdProcedure.md)
- 🚧 [`Tevm.anvil.getAutomine'](../reference/@tevm/procedures-types/type-aliases/AnvilGetAutomineProcedure.md)
- 🚧 [`Tevm.anvil.setStorageAt'](../reference/@tevm/procedures-types/type-aliases/AnvilSetStorageAtProcedure.md)
- 🚧 [`Tevm.anvil.dropTransaction'](../reference/@tevm/procedures-types/type-aliases/AnvilDropTransactionProcedure.md)
- 🚧 [`Tevm.anvil.impersonateAccount'](../reference/@tevm/procedures-types/type-aliases/AnvilImpersonateAccountProcedure.md)
- 🚧 [`Tevm.anvil.stopImpersonatingAccount'](../reference/@tevm/procedures-types/type-aliases/AnvilStopImpersonatingAccountProcedure.md)
