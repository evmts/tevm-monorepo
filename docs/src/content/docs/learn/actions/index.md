---
title: Actions
description: Tevm actions api
---

## Overview

Tevm has an [actions based api](/reference/tevm/actions-types/api) similar to [viem's actions api](https://viem.sh/docs/actions/public/getbalance) and following similar patterns. This is a higher level of abstraction than the lower level [JSON-RPC api](/learn/json-rpc)

## Tevm actions

Tevm methods are the main recomended way to interact with Tevm. 🚧 means the procedure is still under construction

- [`Tevm.call`](/reference/tevm/actions-types/type-aliases/callhandler) - Similar to eth call but with additional properties to control the VM execution
- [`Tevm.getAccount`](/reference/tevm/actions-types/type-aliases/getaccounthandler) - gets account information such as balances contract information nonces and state roots.
- [`Tevm.setAccount`](/reference/tevm/actions-types/type-aliases/setaccounthandler) - directly modifies the state of an account
- [`Tevm.contract`](/reference/tevm/actions-types/type-aliases/callhandler) - Similar to eth call but with additional properties to control the VM execution
- [`Tevm.script`](/reference/tevm/actions-types/type-aliases/scripthandler) - Runs the provided bytecode against the EVM state
- 🚧 `Tevm.traceContractCall`
- 🚧 `Tevm.traceScript`
- [`Tevm.dumpState`](/reference/tevm/actions-types/type-aliases/dumpstatehandler) - Returns the state of the VM
- [`Tevm.loadState`](/reference/tevm/actions-types/type-aliases/loadstatehandler) - Initializes the state of the VM

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`Tevm.eth.accounts'](/reference/tevm/actions-types/type-aliases/ethaccountshandler) - Uses the same test accounts ganache anvil and hardhat uses. Mnemonic:          test test test test test test test test test test test junk
- [`Tevm.eth.call'](/reference/tevm/actions-types/type-aliases/ethcallhandler)
- [`Tevm.eth.chainId'](/reference/tevm/actions-types/type-aliases/ethchainidhandler)
- [`Tevm.eth.estimateGas'](/reference/tevm/actions-types/type-aliases/ethestimategashandler)
- [`Tevm.eth.gasPrice'](/reference/tevm/actions-types/type-aliases/ethgaspricehandler)
- [`Tevm.eth.getBalance'](/reference/tevm/actions-types/type-aliases/ethgetbalancehandler)
- [`Tevm.eth.getCode'](/reference/tevm/actions-types/type-aliases/ethgetcodehandler)
- [`Tevm.eth.getStorageAt'](/reference/tevm/actions-types/type-aliases/ethgetcodehandler)
- [`Tevm.eth.sign'](/reference/tevm/actions-types/type-aliases/ethsignhandler)
- [`Tevm.eth.signTransaction'](/reference/tevm/actions-types/type-aliases/ethsigntransactionhandler)
- 🚧 [`Tevm.eth.getLogs'](/reference/tevm/actions-types/type-aliases/ethgetlogshandler)
- 🚧 [`Tevm.eth.coinbase'](/reference/tevm/actions-types/type-aliases/ethcoinbasehandler)
- 🚧 [`Tevm.eth.hashrate'](/reference/tevm/actions-types/type-aliases/ethhashratehandler)
- 🚧 [`Tevm.eth.newFilter'](/reference/tevm/actions-types/type-aliases/ethnewfilterhandler)
- 🚧 [`Tevm.eth.getFilterLogs'](/reference/tevm/actions-types/type-aliases/ethgetfilterlogshandler)
- 🚧 [`Tevm.eth.getBlockByHash'](/reference/tevm/actions-types/type-aliases/ethgetblockbyhashhandler)
- 🚧 [`Tevm.eth.newBlockFilter'](/reference/tevm/actions-types/type-aliases/ethnewblockfilterhandler)
- 🚧 [`Tevm.eth.protocolVersion'](/reference/tevm/actions-types/type-aliases/ethprotocolversionhandler)
- 🚧 [`Tevm.eth.sendTransaction'](/reference/tevm/actions-types/type-aliases/ethsendtransactionhandler)
- 🚧 [`Tevm.eth.uninstallFilter'](/reference/tevm/actions-types/type-aliases/ethuninstallfilterhandler)
- 🚧 [`Tevm.eth.getBlockByNumber'](/reference/tevm/actions-types/type-aliases/ethgetblockbynumberhandler)
- 🚧 [`Tevm.eth.getFilterChanges'](/reference/tevm/actions-types/type-aliases/ethgetfilterchangeshandler)
- 🚧 [`Tevm.eth.sendRawTransaction'](/reference/tevm/actions-types/type-aliases/ethsendrawtransactionhandler)
- 🚧 [`Tevm.eth.getTransactionCount'](/reference/tevm/actions-types/type-aliases/ethgettransactioncounthandler)
- 🚧 [`Tevm.eth.getTransactionByHash'](/reference/tevm/actions-types/type-aliases/ethgettransactionbyhashhandler)
- 🚧 [`Tevm.eth.getTransactionReceipt'](/reference/tevm/actions-types/type-aliases/ethgettransactionreceipthandler)
- 🚧 `Tevm.eth.newPendingTransactionFilter'
- 🚧 [`Tevm.eth.getBlockTransactionCountByHash'](/reference/tevm/actions-types/type-aliases/ethgetblocktransactioncountbyhashhandler)
- 🚧 `Tevm.eth.getBlockTransactionCountByNumber'
- 🚧 [`Tevm.eth.getTransactionByBlockHashAndIndex'](/reference/tevm/actions-types/type-aliases/ethgettransactionbyblockhashandindexhandler)
- 🚧 `Tevm.eth.getTransactionByBlockNumberAndIndex'

## Debug methods

- 🚧 [`Tevm.debug.traceTransaction`](/reference/tevm/actions-types/type-aliases/debugtracetransactionhandler)
- 🚧 [`Tevm.debug.traceCall`](/reference/tevm/actions-types/type-aliases/debugtracecallhandler)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- 🚧 [`Tevm.anvil.mine'](/reference/tevm/actions-types/type-aliases/anvilminehandler)
- 🚧 [`Tevm.anvil.reset'](/reference/tevm/actions-types/type-aliases/anvilresethandler)
- 🚧 [`Tevm.anvil.setCode'](/reference/tevm/actions-types/type-aliases/anvilsetcodehandler)
- 🚧 [`Tevm.anvil.setNonce'](/reference/tevm/actions-types/type-aliases/anvilsetnoncehandler)
- 🚧 [`Tevm.anvil.dumpState'](/reference/tevm/actions-types/type-aliases/anvildumpstatehandler)
- 🚧 [`Tevm.anvil.loadState'](/reference/tevm/actions-types/type-aliases/anvilloadstatehandler)
- 🚧 [`Tevm.anvil.setBalance'](/reference/tevm/actions-types/type-aliases/anvilsetbalancehandler)
- 🚧 [`Tevm.anvil.setChainId'](/reference/tevm/actions-types/type-aliases/anvilsetchainidhandler)
- 🚧 [`Tevm.anvil.getAutomine'](/reference/tevm/actions-types/type-aliases/anvilgetautominehandler)
- 🚧 [`Tevm.anvil.setStorageAt'](/reference/tevm/actions-types/type-aliases/anvilsetstorageathandler)
- 🚧 [`Tevm.anvil.dropTransaction'](/reference/tevm/actions-types/type-aliases/anvildroptransactionhandler)
- 🚧 [`Tevm.anvil.impersonateAccount'](/reference/tevm/actions-types/type-aliases/anvilimpersonateaccounthandler)
- 🚧 [`Tevm.anvil.stopImpersonatingAccount'](/reference/tevm/actions-types/type-aliases/anvilstopimpersonatingaccounthandler)

## Tree shakeable actions

Like viem, Tevm provides tree shakable versions of the actions in the [tevm/procedures](/reference/tevm/procedures/api) package. But for Tevm it is recomended you use the higher level [client apis](/learn/clients). If bundle size is a concern a more effective way of reducing bundle size is using a [remote http client](/reference/tevm/http-client/api) and running the EVM on a [backend server](/reference/tevm/server/api)

