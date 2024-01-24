---
title: JSON-RPC
description: JSON Remote Procedure Calls
---

## Overview

Tevm has an [actions based api](../reference/@tevm/actions-types/API.md) similar to [viem's actions api](https://viem.sh/docs/actions/public/getBalance) and following similar patterns. This is a higher level of abstraction than the lower level [JSON-RPC api](./json-rpc.md)

## Tevm actions

Tevm methods are the main recomended way to interact with Tevm. 🚧 means the procedure is still under construction

- [`Tevm.call`](../reference/@tevm/actions-types/type-aliases/CallHandler.md) - Similar to eth call but with additional properties to control the VM execution
- [`Tevm.getAccount`](../reference/@tevm/actions-types/type-aliases/GetAccountHandler.md) - gets account information such as balances contract information nonces and state roots.
- [`Tevm.setAccount`](../reference/@tevm/actions-types/type-aliases/SetAccountHandler.md) - directly modifies the state of an account
- [`Tevm.contract`](../reference/@tevm/actions-types/type-aliases/CallHandler.md) - Similar to eth call but with additional properties to control the VM execution
- [`Tevm.script`](../reference/@tevm/actions-types/type-aliases/ScriptHandler.md) - Runs the provided bytecode against the EVM state
- 🚧 [`Tevm.traceContractCall`](../reference/@tevm/actions-types/type-aliases/TraceContractCallHandler.md) 
- 🚧 [`Tevm.traceScript`](../reference/@tevm/actions-types/type-aliases/TraceScriptHandler.md) 
- [`Tevm.dumpState`](../reference/@tevm/actions-types/type-aliases/DumpStateHandler.md) - Returns the state of the VM
- [`Tevm.loadState`](../reference/@tevm/actions-types/type-aliases/LoadStateHandler.md) - Initializes the state of the VM

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`Tevm.eth.chainId'](../reference/@tevm/actions-types/type-aliases/EthChainIdHandler.md)
- [`Tevm.eth.call'](../reference/@tevm/actions-types/type-aliases/EthCallHandler.md)
- [`Tevm.eth.getCode'](../reference/@tevm/actions-types/type-aliases/EthGetCodeHandler.md)
- [`Tevm.eth.getStorageAt'](../reference/@tevm/actions-types/type-aliases/EthGetCodeHandler.md)
- [`Tevm.eth.gasPrice'](../reference/@tevm/actions-types/type-aliases/EthGasPriceHandler.md)
- [`Tevm.eth.getBalance'](../reference/@tevm/actions-types/type-aliases/EthGetBalanceHandler.md)
- [`Tevm.eth.estimateGas'](../reference/@tevm/actions-types/type-aliases/EthEstimateGasHandler.md)
- 🚧 [`Tevm.eth.sign'](../reference/@tevm/actions-types/type-aliases/EthSignProcedure.md)
- 🚧 [`Tevm.eth.getLogs'](../reference/@tevm/actions-types/type-aliases/EthGetLogsHandler.md)
- 🚧 [`Tevm.eth.accounts'](../reference/@tevm/actions-types/type-aliases/EthAccountsHandler.md)
- 🚧 [`Tevm.eth.coinbase'](../reference/@tevm/actions-types/type-aliases/EthCoinbaseHandler.md)
- 🚧 [`Tevm.eth.hashrate'](../reference/@tevm/actions-types/type-aliases/EthHashRateHandler.md)
- 🚧 [`Tevm.eth.newFilter'](../reference/@tevm/actions-types/type-aliases/EthNewFilterHandler.md)
- 🚧 [`Tevm.eth.getFilterLogs'](../reference/@tevm/actions-types/type-aliases/EthGetFilterLogsHandler.md)
- 🚧 [`Tevm.eth.getBlockByHash'](../reference/@tevm/actions-types/type-aliases/EthGetBlockByHashHandler.md)
- 🚧 [`Tevm.eth.newBlockFilter'](../reference/@tevm/actions-types/type-aliases/EthNewBlockFilterHandler.md)
- 🚧 [`Tevm.eth.protocolVersion'](../reference/@tevm/actions-types/type-aliases/EthProtocolVersionHandler.md)
- 🚧 [`Tevm.eth.sendTransaction'](../reference/@tevm/actions-types/type-aliases/EthSendTransactionHandler.md)
- 🚧 [`Tevm.eth.signTransaction'](../reference/@tevm/actions-types/type-aliases/EthSignTransactionHandler.md)
- 🚧 [`Tevm.eth.uninstallFilter'](../reference/@tevm/actions-types/type-aliases/EthUninstallFilterHandler.md)
- 🚧 [`Tevm.eth.getBlockByNumber'](../reference/@tevm/actions-types/type-aliases/EthGetBlockByNumberHandler.md)
- 🚧 [`Tevm.eth.getFilterChanges'](../reference/@tevm/actions-types/type-aliases/EthGetFilterChangesHandler.md)
- 🚧 [`Tevm.eth.sendRawTransaction'](../reference/@tevm/actions-types/type-aliases/EthSendRawTransactionHandler.md)
- 🚧 [`Tevm.eth.getTransactionCount'](../reference/@tevm/actions-types/type-aliases/EthGetTransactionCountHandler.md)
- 🚧 [`Tevm.eth.getTransactionByHash'](../reference/@tevm/actions-types/type-aliases/EthGetTransactionByHashHandler.md)
- 🚧 [`Tevm.eth.getTransactionReceipt'](../reference/@tevm/actions-types/type-aliases/EthGetTransactionReceiptHandler.md)
- 🚧 [`Tevm.eth.newPendingTransactionFilter'](../reference/@tevm/actions-types/type-aliases/EthNewPendingTransactionFilterJsonRpcResponse.md)
- 🚧 [`Tevm.eth.getBlockTransactionCountByHash'](../reference/@tevm/actions-types/type-aliases/EthGetBlockTransactionCountByHashHandler.md)
- 🚧 [`Tevm.eth.getBlockTransactionCountByNumber'](../reference/@tevm/actions-types/type-aliases/Tevm.eth.getBlockTransactionCountByNumber.md)
- 🚧 [`Tevm.eth.getTransactionByBlockHashAndIndex'](../reference/@tevm/actions-types/type-aliases/EthGetTransactionByBlockHashAndIndexHandler.md)
- 🚧 [`Tevm.eth.getTransactionByBlockNumberAndIndex'](../reference/@tevm/actions-types/type-aliases/EthTransactionByBlockNumberAndIndexHandler.md)

## Debug methods

- 🚧 [`Tevm.debug.traceTransaction`](../reference/@tevm/actions-types/type-aliases/DebugTraceTransactionHandler.md)
- 🚧 [`Tevm.debug.traceCall`](../reference/@tevm/actions-types/type-aliases/DebugTraceCallHandler.md)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`Tevm.anvil.mine'](../reference/@tevm/actions-types/type-aliases/AnvilMineHandler.md)
- 🚧 [`Tevm.anvil.reset'](../reference/@tevm/actions-types/type-aliases/AnvilResetHandler.md)
- 🚧 [`Tevm.anvil.setCode'](../reference/@tevm/actions-types/type-aliases/AnvilSetCodeHandler.md)
- 🚧 [`Tevm.anvil.setNonce'](../reference/@tevm/actions-types/type-aliases/AnvilSetNonceHandler.md)
- 🚧 [`Tevm.anvil.dumpState'](../reference/@tevm/actions-types/type-aliases/AnvilDumpStateHandler.md)
- 🚧 [`Tevm.anvil.loadState'](../reference/@tevm/actions-types/type-aliases/AnvilLoadStateHandler.md)
- 🚧 [`Tevm.anvil.setBalance'](../reference/@tevm/actions-types/type-aliases/AnvilSetBalanceHandler.md)
- 🚧 [`Tevm.anvil.setChainId'](../reference/@tevm/actions-types/type-aliases/AnvilSetChainIdHandler.md)
- 🚧 [`Tevm.anvil.getAutomine'](../reference/@tevm/actions-types/type-aliases/AnvilGetAutomineHandler.md)
- 🚧 [`Tevm.anvil.setStorageAt'](../reference/@tevm/actions-types/type-aliases/AnvilSetStorageAtHandler.md)
- 🚧 [`Tevm.anvil.dropTransaction'](../reference/@tevm/actions-types/type-aliases/AnvilDropTransactionHandler.md)
- 🚧 [`Tevm.anvil.impersonateAccount'](../reference/@tevm/actions-types/type-aliases/AnvilImpersonateAccountHandler.md)
- 🚧 [`Tevm.anvil.stopImpersonatingAccount'](../reference/@tevm/actions-types/type-aliases/AnvilStopImpersonatingAccountHandler.md)

## Tree shakeable actions

Like viem, Tevm provides tree shakable versions of the actions in the [tevm/procedures](../reference/@tevm/procedures/) package. But for Tevm it is recomended you use the higher level [client apis](./clients.md). If bundle size is a concern a more effective way of reducing bundle size is using a [remote http client](../reference/@tevm/http-client/API.md) and running the EVM on a [backend server](../reference/@tevm/server/API.md)

