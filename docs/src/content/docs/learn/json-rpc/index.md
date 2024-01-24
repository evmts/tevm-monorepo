---
title: JSON-RPC
description: JSON Remote Procedure Calls
---

## JSON-RPC Requests

All [clients](./clients.md) implement a [`tevm.request()`](../reference/@tevm/procedures-types/type-aliases/tevmjsonrpcrequesthandler.md) method for handling JSON-RPC requests.

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

- [`tevm_call`](../reference/@tevm/procedures-types/type-aliases/calljsonrpcprocedure.md) - Similar to eth call but with additional properties to control the VM execution
- [`tevm_getAccount`](../reference/@tevm/procedures-types/type-aliases/getaccountjsonrpcprocedure.md) - gets account information such as balances contract information nonces and state roots.
- [`tevm_setAccount`](../reference/@tevm/procedures-types/type-aliases/setaccountjsonrpcprocedure.md) - directly modifies the state of an account
- [`tevm_script`](../reference/@tevm/procedures-types/type-aliases/scriptjsonrpcprocedure.md) - Runs the provided bytecode against the EVM state
- 🚧 [`tevm_traceContractCall`](../reference/@tevm/procedures-types/type-aliases/tracecontractcalljsonrpcprocedure.md) 
- 🚧 [`tevm_traceScript`](../reference/@tevm/procedures-types/type-aliases/tracescriptjsonrpcprocedure.md) 
- [`tevm_dumpState`](../reference/@tevm/procedures-types/type-aliases/dumpstatejsonrpcprocedure.md) - Returns the state of the VM
- [`tevm_loadState`](../reference/@tevm/procedures-types/type-aliases/loadstatejsonrpcprocedure.md) - Initializes the state of the VM

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`eth_chainId'](../reference/@tevm/procedures-types/type-aliases/ethchainidjsonrpcprocedure.md)
- [`eth_call'](../reference/@tevm/procedures-types/type-aliases/ethcalljsonrpcprocedure.md)
- [`eth_getCode'](../reference/@tevm/procedures-types/type-aliases/ethgetcodejsonrpcprocedure.md)
- [`eth_getStorageAt'](../reference/@tevm/procedures-types/type-aliases/ethgetcodejsonrpcprocedure.md)
- [`eth_gasPrice'](../reference/@tevm/procedures-types/type-aliases/ethgaspricejsonrpcprocedure.md)
- [`eth_getBalance'](../reference/@tevm/procedures-types/type-aliases/ethgetbalancejsonrpcprocedure.md)
- [`eth_estimateGas'](../reference/@tevm/procedures-types/type-aliases/ethestimategasjsonrpcprocedure.md)
- 🚧 [`eth_sign'](../reference/@tevm/procedures-types/type-aliases/ethsignprocedure.md)
- 🚧 [`eth_getLogs'](../reference/@tevm/procedures-types/type-aliases/ethgetlogsjsonrpcprocedure.md)
- 🚧 [`eth_accounts'](../reference/@tevm/procedures-types/type-aliases/ethaccountsjsonrpcprocedure.md)
- 🚧 [`eth_coinbase'](../reference/@tevm/procedures-types/type-aliases/ethcoinbasejsonrpcprocedure.md)
- 🚧 [`eth_hashrate'](../reference/@tevm/procedures-types/type-aliases/ethhashratejsonrpcprocedure.md)
- 🚧 [`eth_newFilter'](../reference/@tevm/procedures-types/type-aliases/ethnewfilterjsonrpcprocedure.md)
- 🚧 [`eth_getFilterLogs'](../reference/@tevm/procedures-types/type-aliases/ethgetfilterlogsjsonrpcprocedure.md)
- 🚧 [`eth_getBlockByHash'](../reference/@tevm/procedures-types/type-aliases/ethgetblockbyhashjsonrpcprocedure.md)
- 🚧 [`eth_newBlockFilter'](../reference/@tevm/procedures-types/type-aliases/ethnewblockfilterjsonrpcprocedure.md)
- 🚧 [`eth_protocolVersion'](../reference/@tevm/procedures-types/type-aliases/ethprotocolversionjsonrpcprocedure.md)
- 🚧 [`eth_sendTransaction'](../reference/@tevm/procedures-types/type-aliases/ethsendtransactionjsonrpcprocedure.md)
- 🚧 [`eth_signTransaction'](../reference/@tevm/procedures-types/type-aliases/ethsigntransactionjsonrpcprocedure.md)
- 🚧 [`eth_uninstallFilter'](../reference/@tevm/procedures-types/type-aliases/ethuninstallfilterjsonrpcprocedure.md)
- 🚧 [`eth_getBlockByNumber'](../reference/@tevm/procedures-types/type-aliases/ethgetblockbynumberjsonrpcprocedure.md)
- 🚧 [`eth_getFilterChanges'](../reference/@tevm/procedures-types/type-aliases/ethgetfilterchangesjsonrpcprocedure.md)
- 🚧 [`eth_sendRawTransaction'](../reference/@tevm/procedures-types/type-aliases/ethsendrawtransactionjsonrpcprocedure.md)
- 🚧 [`eth_getTransactionCount'](../reference/@tevm/procedures-types/type-aliases/ethgettransactioncountjsonrpcprocedure.md)
- 🚧 [`eth_getTransactionByHash'](../reference/@tevm/procedures-types/type-aliases/ethgettransactionbyhashjsonrpcprocedure.md)
- 🚧 [`eth_getTransactionReceipt'](../reference/@tevm/procedures-types/type-aliases/ethgettransactionreceiptjsonrpcprocedure.md)
- 🚧 [`eth_newPendingTransactionFilter'](../reference/@tevm/procedures-types/type-aliases/ethnewpendingtransactionfilterjsonrpcresponse.md)
- 🚧 [`eth_getBlockTransactionCountByHash'](../reference/@tevm/procedures-types/type-aliases/ethgetblocktransactioncountbyhashjsonrpcprocedure.md)
- 🚧 [`eth_getBlockTransactionCountByNumber'](../reference/@tevm/procedures-types/type-aliases/eth_getblocktransactioncountbynumber.md)
- 🚧 [`eth_getTransactionByBlockHashAndIndex'](../reference/@tevm/procedures-types/type-aliases/ethgettransactionbyblockhashandindexjsonrpcprocedure.md)
- 🚧 [`eth_getTransactionByBlockNumberAndIndex'](../reference/@tevm/procedures-types/type-aliases/ethtransactionbyblocknumberandindexjsonrpcprocedure.md)

## Debug methods

- 🚧 [`debug_traceTransaction`](../reference/@tevm/procedures-types/type-aliases/debugtracetransactionprocedure.md)
- 🚧 [`debug_traceCall`](../reference/@tevm/procedures-types/type-aliases/debugtracecallprocedure.md)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`anvil_mine'](../reference/@tevm/procedures-types/type-aliases/anvilmineprocedure.md)
- 🚧 [`anvil_reset'](../reference/@tevm/procedures-types/type-aliases/anvilresetprocedure.md)
- 🚧 [`anvil_setCode'](../reference/@tevm/procedures-types/type-aliases/anvilsetcodeprocedure.md)
- 🚧 [`anvil_setNonce'](../reference/@tevm/procedures-types/type-aliases/anvilsetnonceprocedure.md)
- 🚧 [`anvil_dumpState'](../reference/@tevm/procedures-types/type-aliases/anvildumpstateprocedure.md)
- 🚧 [`anvil_loadState'](../reference/@tevm/procedures-types/type-aliases/anvilloadstateprocedure.md)
- 🚧 [`anvil_setBalance'](../reference/@tevm/procedures-types/type-aliases/anvilsetbalanceprocedure.md)
- 🚧 [`anvil_setChainId'](../reference/@tevm/procedures-types/type-aliases/anvilsetchainidprocedure.md)
- 🚧 [`anvil_getAutomine'](../reference/@tevm/procedures-types/type-aliases/anvilgetautomineprocedure.md)
- 🚧 [`anvil_setStorageAt'](../reference/@tevm/procedures-types/type-aliases/anvilsetstorageatprocedure.md)
- 🚧 [`anvil_dropTransaction'](../reference/@tevm/procedures-types/type-aliases/anvildroptransactionprocedure.md)
- 🚧 [`anvil_impersonateAccount'](../reference/@tevm/procedures-types/type-aliases/anvilimpersonateaccountprocedure.md)
- 🚧 [`anvil_stopImpersonatingAccount'](../reference/@tevm/procedures-types/type-aliases/anvilstopimpersonatingaccountprocedure.md)
