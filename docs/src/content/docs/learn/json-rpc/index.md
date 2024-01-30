---
title: JSON-RPC
description: JSON Remote Procedure Calls
---

## JSON-RPC Requests

All [clients](/learn/clients) implement a [`tevm.request()`](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequesthandler) method for handling JSON-RPC requests.

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

- [`tevm_call`](/reference/tevm/procedures-types/type-aliases/calljsonrpcprocedure) - Similar to eth call but with additional properties to control the VM execution
- [`tevm_getAccount`](/reference/tevm/procedures-types/type-aliases/getaccountjsonrpcprocedure) - gets account information such as balances contract information nonces and state roots.
- [`tevm_setAccount`](/reference/tevm/procedures-types/type-aliases/setaccountjsonrpcprocedure) - directly modifies the state of an account
- [`tevm_script`](/reference/tevm/procedures-types/type-aliases/scriptjsonrpcprocedure) - Runs the provided bytecode against the EVM state
- [`tevm_dumpState`](/reference/tevm/procedures-types/type-aliases/dumpstatejsonrpcprocedure) - Returns the state of the VM
- [`tevm_loadState`](/reference/tevm/procedures-types/type-aliases/loadstatejsonrpcprocedure) - Initializes the state of the VM
- 🚧 `tevm_traceContractCall`
- 🚧 `tevm_traceScript`

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`eth_accounts'](/reference/tevm/procedures-types/type-aliases/ethaccountsjsonrpcprocedure) - Uses the same test accounts ganache anvil and hardhat uses. Mnemonic:          test test test test test test test test test test test junk
- [`eth_call'](/reference/tevm/procedures-types/type-aliases/ethcalljsonrpcprocedure)
- [`eth_chainId'](/reference/tevm/procedures-types/type-aliases/ethchainidjsonrpcprocedure)
- [`eth_estimateGas'](/reference/tevm/procedures-types/type-aliases/ethestimategasjsonrpcprocedure)
- [`eth_gasPrice'](/reference/tevm/procedures-types/type-aliases/ethgaspricejsonrpcprocedure)
- [`eth_getBalance'](/reference/tevm/procedures-types/type-aliases/ethgetbalancejsonrpcprocedure)
- [`eth_getCode'](/reference/tevm/procedures-types/type-aliases/ethgetcodejsonrpcprocedure)
- [`eth_getStorageAt'](/reference/tevm/procedures-types/type-aliases/ethgetcodejsonrpcprocedure)
- [`eth_sign'](/reference/tevm/procedures-types/type-aliases/ethsignjsonrpcprocedure)
- [`eth_signTransaction'](/reference/tevm/procedures-types/type-aliases/ethsigntransactionjsonrpcprocedure)
- 🚧 [`eth_getLogs'](/reference/tevm/procedures-types/type-aliases/ethgetlogsjsonrpcprocedure)
- 🚧 [`eth_coinbase'](/reference/tevm/procedures-types/type-aliases/ethcoinbasejsonrpcprocedure)
- 🚧 [`eth_hashrate'](/reference/tevm/procedures-types/type-aliases/ethhashratejsonrpcprocedure)
- 🚧 [`eth_newFilter'](/reference/tevm/procedures-types/type-aliases/ethnewfilterjsonrpcprocedure)
- 🚧 [`eth_getFilterLogs'](/reference/tevm/procedures-types/type-aliases/ethgetfilterlogsjsonrpcprocedure)
- 🚧 [`eth_getBlockByHash'](/reference/tevm/procedures-types/type-aliases/ethgetblockbyhashjsonrpcprocedure)
- 🚧 [`eth_newBlockFilter'](/reference/tevm/procedures-types/type-aliases/ethnewblockfilterjsonrpcprocedure)
- 🚧 [`eth_protocolVersion'](/reference/tevm/procedures-types/type-aliases/ethprotocolversionjsonrpcprocedure)
- 🚧 [`eth_sendTransaction'](/reference/tevm/procedures-types/type-aliases/ethsendtransactionjsonrpcprocedure)
- 🚧 [`eth_uninstallFilter'](/reference/tevm/procedures-types/type-aliases/ethuninstallfilterjsonrpcprocedure)
- 🚧 [`eth_getBlockByNumber'](/reference/tevm/procedures-types/type-aliases/ethgetblockbynumberjsonrpcprocedure)
- 🚧 [`eth_getFilterChanges'](/reference/tevm/procedures-types/type-aliases/ethgetfilterchangesjsonrpcprocedure)
- 🚧 [`eth_sendRawTransaction'](/reference/tevm/procedures-types/type-aliases/ethsendrawtransactionjsonrpcprocedure)
- 🚧 [`eth_getTransactionCount'](/reference/tevm/procedures-types/type-aliases/ethgettransactioncountjsonrpcprocedure)
- 🚧 [`eth_getTransactionByHash'](/reference/tevm/procedures-types/type-aliases/ethgettransactionbyhashjsonrpcprocedure)
- 🚧 [`eth_getTransactionReceipt'](/reference/tevm/procedures-types/type-aliases/ethgettransactionreceiptjsonrpcprocedure)
- 🚧 [`eth_newPendingTransactionFilter'](/reference/tevm/procedures-types/type-aliases/ethnewpendingtransactionfilterjsonrpcresponse)
- 🚧 [`eth_getBlockTransactionCountByHash'](/reference/tevm/procedures-types/type-aliases/ethgetblocktransactioncountbyhashjsonrpcprocedure)
- 🚧 `eth_getBlockTransactionCountByNumber'
- 🚧 [`eth_getTransactionByBlockHashAndIndex'](/reference/tevm/procedures-types/type-aliases/ethgettransactionbyblockhashandindexjsonrpcprocedure)
- 🚧 `eth_getTransactionByBlockNumberAndIndex'

## Debug methods

- 🚧 [`debug_traceTransaction`](/reference/tevm/procedures-types/type-aliases/debugtracetransactionprocedure)
- 🚧 [`debug_traceCall`](/reference/tevm/procedures-types/type-aliases/debugtracecallprocedure)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`anvil_mine'](/reference/tevm/procedures-types/type-aliases/anvilmineprocedure)
- 🚧 [`anvil_reset'](/reference/tevm/procedures-types/type-aliases/anvilresetprocedure)
- 🚧 [`anvil_setCode'](/reference/tevm/procedures-types/type-aliases/anvilsetcodeprocedure)
- 🚧 [`anvil_setNonce'](/reference/tevm/procedures-types/type-aliases/anvilsetnonceprocedure)
- 🚧 [`anvil_dumpState'](/reference/tevm/procedures-types/type-aliases/anvildumpstateprocedure)
- 🚧 [`anvil_loadState'](/reference/tevm/procedures-types/type-aliases/anvilloadstateprocedure)
- 🚧 [`anvil_setBalance'](/reference/tevm/procedures-types/type-aliases/anvilsetbalanceprocedure)
- 🚧 [`anvil_setChainId'](/reference/tevm/procedures-types/type-aliases/anvilsetchainidprocedure)
- 🚧 [`anvil_getAutomine'](/reference/tevm/procedures-types/type-aliases/anvilgetautomineprocedure)
- 🚧 [`anvil_setStorageAt'](/reference/tevm/procedures-types/type-aliases/anvilsetstorageatprocedure)
- 🚧 [`anvil_dropTransaction'](/reference/tevm/procedures-types/type-aliases/anvildroptransactionprocedure)
- 🚧 [`anvil_impersonateAccount'](/reference/tevm/procedures-types/type-aliases/anvilimpersonateaccountprocedure)
- 🚧 [`anvil_stopImpersonatingAccount'](/reference/tevm/procedures-types/type-aliases/anvilstopimpersonatingaccountprocedure)
