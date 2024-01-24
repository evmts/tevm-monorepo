---
title: Tevm clients guide
description: Introduction to clients and actions
---

## Tevm Clients

The interface to Tevm api is called [TevmClient](../../reference/@tevm/client-types/type-aliases/TevmClient.md). This api provides a uniform API for interacting with Tevm whether interacting with a [MemoryClient](./memory-client.md) directly or remotely interacting via an [HttpCLient](../../reference/@tevm/http-client/type-aliases/HttpClient.md). Tevm clients share the same [actions](./actions.md) based interface along with a [`request`](../reference/@tevm/memory-client/type-aliases/MemoryClient.md#request) method for handling JSON-RPC requests.

The following clients are available

- [MemoryClient](./memory-client.md) - An in memory instance of the EVM that can run in Node.js, bun or the browser
- [HttpClient](./http-client.md) - A client that talks to a remote `MemoryClient` running in an [http server](../reference/@tevm/server/API.md) 
- [Viem extensions](../reference/@tevm/viem/API.md) - Provides a viem based client instance and some experimental optimistic updating apis.
- 🚧 Under construction [Ethers extensions](../reference/@tevm/ethers/API.md) - An ethers based memory client and http client
- 🚧 Under construction `WebsocketClient` - A web socket based TevmClient similar to the `HttpClient`

## JSON-RPC Requests

All clients implement a [`tevm.request()`](../reference/@tevm/procedures-types/type-aliases/TevmJsonRpcRequestHandler.md) method for handling JSON-RPC requests. The following JsonRPC m

```typescript
const {result, errors, id, method, jsonrpc} = await client.request({
 method: 'eth_blockNumber',
 params: [],
 id: 1,
 jsonrpc: '2.0',
})
```

The following JSON-RPC methods are available or will be available in near future

**Tevm methods**

- [`tevm_call`](../reference/@tevm/procedures-types/type-aliases/CallJsonRpcProcedure.md) - Similar to eth call but with additional properties to control the VM execution
- [`tevm_getAccount`](../reference/@tevm/procedures-types/type-aliases/GetAccountJsonRpcProcedure.md) - gets account information such as balances contract information nonces and state roots.
- [`tevm_setAccount`](../reference/@tevm/procedures-types/type-aliases/SetAccountJsonRpcProcedure.md) - directly modifies the state of an account
- [`tevm_script`](../reference/@tevm/procedures-types/type-aliases/ScriptJsonRpcProcedure.md) - Runs the provided bytecode against the EVM state
- 🚧 [`tevm_traceContractCall`](../reference/@tevm/procedures-types/type-aliases/TraceContractCallJsonRpcProcedure.md) 
- 🚧 [`tevm_traceScript`](../reference/@tevm/procedures-types/type-aliases/TraceScriptJsonRpcProcedure.md) 
- [`tevm_dumpState`](../reference/@tevm/procedures-types/type-aliases/DumpStateJsonRpcProcedure.md) - Returns the state of the VM
- [`tevm_loadState`](../reference/@tevm/procedures-types/type-aliases/LoadStateJsonRpcProcedure.md) - Initializes the state of the VM

**Debug methods**

- 🚧 [`debug_traceTransaction`](../reference/@tevm/procedures-types/type-aliases/DebugTraceTransactionProcedure.md)
- 🚧 [`debug_traceCall`](../reference/@tevm/procedures-types/type-aliases/DebugTraceCallProcedure.md)

**Eth methods**

- [`eth_chainId'](../reference/@tevm/procedures-types/type-aliases/EthChainIdJsonRpcProcedure.md)
- [`eth_call'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getCode'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getStorageAt'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_gasPrice'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getBalance'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_estimateGas'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_sign'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_mining'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getLogs'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_syncing'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_accounts'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_coinbase'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_hashrate'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_newFilter'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getFilterLogs'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getBlockByHash'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_newBlockFilter'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_protocolVersion'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_sendTransaction'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_signTransaction'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_uninstallFilter'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getBlockByNumber'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getFilterChanges'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_sendRawTransaction'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getTransactionCount'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getTransactionByHash'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getTransactionReceipt'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getUncleCountByBlockHash'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getUncleCountByBlockNumber'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getUncleByBlockHashAndIndex'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_newPendingTransactionFilter'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getUncleByBlockNumberAndIndex'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getBlockTransactionCountByHash'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getBlockTransactionCountByNumber'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getTransactionByBlockHashAndIndex'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`eth_getTransactionByBlockNumberAndIndex'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)

**Anvil/Hardhat methods** 

- [`anvil_mine'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_reset'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_setCode'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_setNonce'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_dumpState'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_loadState'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_setBalance'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_setChainId'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_getAutomine'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_setStorageAt'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_dropTransaction'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_impersonateAccount'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
- [`anvil_stopImpersonatingAccount'](../reference/@tevm/procedures-typestype-aliasesEthChainIdJsonRpcProcedure.md)
