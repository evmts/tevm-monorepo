---
title: Actions
description: Tevm actions api
---

## Overview

Tevm has an [actions based api](/reference/tevm/actions-types/api) similar to [viem's actions api](https://viem.sh/docs/actions/public/getbalance) and following similar patterns. This is a higher level of abstraction than the lower level [JSON-RPC api](/learn/json-rpc)

## Errors

All actions return errors as values

```typescript
const {errors} = client.setAccount({})
if (errors?.length) {
  console.log(errors[0]).name // AddressRequiredError
  console.log(errors[0].message) // AddressRequiredError: `address` is a required property
}
```

As a best practice you should always check the errors property for errors. In future versions of tevm we may expose the ability to throw instead as a configuration option to the client. Consider joining the telegram if you would like this feature.

## TevmClient actions

TevmClient methods are the main recomended way to interact with Tevm. 🚧 means the procedure is still under construction

- [`TevmClient.call`](/reference/tevm/actions-types/type-aliases/callhandler) - Similar to eth call but with additional properties to control the VM execution
- [`TevmClient.getAccount`](/reference/tevm/actions-types/type-aliases/getaccounthandler) - gets account information such as balances contract information nonces and state roots.
- [`TevmClient.setAccount`](/reference/tevm/actions-types/type-aliases/setaccounthandler) - directly modifies the state of an account
- [`TevmClient.contract`](/reference/tevm/actions-types/type-aliases/callhandler) - Similar to eth call but with additional properties to control the VM execution
- [`TevmClient.script`](/reference/tevm/actions-types/type-aliases/scripthandler) - Runs the provided bytecode against the EVM state
- 🚧 `TevmClient.traceContractCall`
- 🚧 `TevmClient.traceScript`
- [`TevmClient.dumpState`](/reference/tevm/actions-types/type-aliases/dumpstatehandler) - Returns the state of the VM
- [`TevmClient.loadState`](/reference/tevm/actions-types/type-aliases/loadstatehandler) - Initializes the state of the VM

Note the `call` family of actions including `TevmClient.call`, `TevmClient.contract`, and `TevmClient.script` will execute in a sandbox and not modify the state. This behavior can be disabled via passing in a `enableTransaction: true` parameter.

## Eth methods

TevmClient plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`TevmClient.eth.accounts'](/reference/tevm/actions-types/type-aliases/ethaccountshandler) - Uses the same test accounts ganache anvil and hardhat uses. Mnemonic:          test test test test test test test test test test test junk
- [`TevmClient.eth.call'](/reference/tevm/actions-types/type-aliases/ethcallhandler)
- [`TevmClient.eth.chainId'](/reference/tevm/actions-types/type-aliases/ethchainidhandler)
- [`TevmClient.eth.estimateGas'](/reference/tevm/actions-types/type-aliases/ethestimategashandler)
- [`TevmClient.eth.gasPrice'](/reference/tevm/actions-types/type-aliases/ethgaspricehandler)
- [`TevmClient.eth.getBalance'](/reference/tevm/actions-types/type-aliases/ethgetbalancehandler)
- [`TevmClient.eth.getCode'](/reference/tevm/actions-types/type-aliases/ethgetcodehandler)
- [`TevmClient.eth.getStorageAt'](/reference/tevm/actions-types/type-aliases/ethgetcodehandler)
- [`TevmClient.eth.sign'](/reference/tevm/actions-types/type-aliases/ethsignhandler)
- [`TevmClient.eth.signTransaction'](/reference/tevm/actions-types/type-aliases/ethsigntransactionhandler)
- 🚧 [`TevmClient.eth.getLogs'](/reference/tevm/actions-types/type-aliases/ethgetlogshandler)
- 🚧 [`TevmClient.eth.coinbase'](/reference/tevm/actions-types/type-aliases/ethcoinbasehandler)
- 🚧 [`TevmClient.eth.hashrate'](/reference/tevm/actions-types/type-aliases/ethhashratehandler)
- 🚧 [`TevmClient.eth.newFilter'](/reference/tevm/actions-types/type-aliases/ethnewfilterhandler)
- 🚧 [`TevmClient.eth.getFilterLogs'](/reference/tevm/actions-types/type-aliases/ethgetfilterlogshandler)
- 🚧 [`TevmClient.eth.getBlockByHash'](/reference/tevm/actions-types/type-aliases/ethgetblockbyhashhandler)
- 🚧 [`TevmClient.eth.newBlockFilter'](/reference/tevm/actions-types/type-aliases/ethnewblockfilterhandler)
- 🚧 [`TevmClient.eth.protocolVersion'](/reference/tevm/actions-types/type-aliases/ethprotocolversionhandler)
- 🚧 [`TevmClient.eth.sendTransaction'](/reference/tevm/actions-types/type-aliases/ethsendtransactionhandler)
- 🚧 [`TevmClient.eth.uninstallFilter'](/reference/tevm/actions-types/type-aliases/ethuninstallfilterhandler)
- 🚧 [`TevmClient.eth.getBlockByNumber'](/reference/tevm/actions-types/type-aliases/ethgetblockbynumberhandler)
- 🚧 [`TevmClient.eth.getFilterChanges'](/reference/tevm/actions-types/type-aliases/ethgetfilterchangeshandler)
- 🚧 [`TevmClient.eth.sendRawTransaction'](/reference/tevm/actions-types/type-aliases/ethsendrawtransactionhandler)
- 🚧 [`TevmClient.eth.getTransactionCount'](/reference/tevm/actions-types/type-aliases/ethgettransactioncounthandler)
- 🚧 [`TevmClient.eth.getTransactionByHash'](/reference/tevm/actions-types/type-aliases/ethgettransactionbyhashhandler)
- 🚧 [`TevmClient.eth.getTransactionReceipt'](/reference/tevm/actions-types/type-aliases/ethgettransactionreceipthandler)
- 🚧 `TevmClient.eth.newPendingTransactionFilter'
- 🚧 [`TevmClient.eth.getBlockTransactionCountByHash'](/reference/tevm/actions-types/type-aliases/ethgetblocktransactioncountbyhashhandler)
- 🚧 `TevmClient.eth.getBlockTransactionCountByNumber'
- 🚧 [`TevmClient.eth.getTransactionByBlockHashAndIndex'](/reference/tevm/actions-types/type-aliases/ethgettransactionbyblockhashandindexhandler)
- 🚧 `TevmClient.eth.getTransactionByBlockNumberAndIndex'

## Debug methods

- 🚧 [`TevmClient.debug.traceTransaction`](/reference/tevm/actions-types/type-aliases/debugtracetransactionhandler)
- 🚧 [`TevmClient.debug.traceCall`](/reference/tevm/actions-types/type-aliases/debugtracecallhandler)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`TevmClient.anvil.mine'](/reference/tevm/actions-types/type-aliases/anvilminehandler)
- 🚧 [`TevmClient.anvil.reset'](/reference/tevm/actions-types/type-aliases/anvilresethandler)
- 🚧 [`TevmClient.anvil.setCode'](/reference/tevm/actions-types/type-aliases/anvilsetcodehandler)
- 🚧 [`TevmClient.anvil.setNonce'](/reference/tevm/actions-types/type-aliases/anvilsetnoncehandler)
- 🚧 [`TevmClient.anvil.dumpState'](/reference/tevm/actions-types/type-aliases/anvildumpstatehandler)
- 🚧 [`TevmClient.anvil.loadState'](/reference/tevm/actions-types/type-aliases/anvilloadstatehandler)
- 🚧 [`TevmClient.anvil.setBalance'](/reference/tevm/actions-types/type-aliases/anvilsetbalancehandler)
- 🚧 [`TevmClient.anvil.setChainId'](/reference/tevm/actions-types/type-aliases/anvilsetchainidhandler)
- 🚧 [`TevmClient.anvil.getAutomine'](/reference/tevm/actions-types/type-aliases/anvilgetautominehandler)
- 🚧 [`TevmClient.anvil.setStorageAt'](/reference/tevm/actions-types/type-aliases/anvilsetstorageathandler)
- 🚧 [`TevmClient.anvil.dropTransaction'](/reference/tevm/actions-types/type-aliases/anvildroptransactionhandler)
- 🚧 [`TevmClient.anvil.impersonateAccount'](/reference/tevm/actions-types/type-aliases/anvilimpersonateaccounthandler)
- 🚧 [`TevmClient.anvil.stopImpersonatingAccount'](/reference/tevm/actions-types/type-aliases/anvilstopimpersonatingaccounthandler)

## Tree shakeable actions

Like viem, TevmClient provides tree shakable versions of the actions in the [tevm/procedures](/reference/tevm/procedures/api) package. But for Tevm it is recomended you use the higher level [client apis](/learn/clients). If bundle size is a concern a more effective way of reducing bundle size is using a [remote http client](/reference/tevm/http-client/api) and running the EVM on a [backend server](/reference/tevm/server/api)

