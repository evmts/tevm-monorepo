---
title: JSON-RPC
description: JSON Remote Procedure Calls
---

## JSON-RPC Requests

All [clients](/learn/clients) implement an EIP-1193 compatable [`tevm.request()`](/reference/tevm/actions/type-aliases/tevmjsonrpcrequesthandler) method for handling JSON-RPC requests.

```typescript
const { result, errors, id, method, jsonrpc } = await client.request(
  "eth_call",
  [data, blockTag, stateOverrides, blockOverrides],
);
```

Below are all procedures implemented or planned to be implemented. 🚧 means the procedure is still under construction

## Tevm methods

Tevm methods are feature-rich methods that provide a high level of control over the VM.

- [`tevm_call`](/reference/tevm/actions/type-aliases/calljsonrpcprocedure) - Similar to eth call but with additional properties to control the VM execution
- [`tevm_getAccount`](/reference/tevm/actions/type-aliases/getaccountjsonrpcprocedure) - gets account information such as balances contract information nonces and state roots.
- [`tevm_setAccount`](/reference/tevm/actions/type-aliases/setaccountjsonrpcprocedure) - directly modifies the state of an account
- [`tevm_dumpState`](/reference/tevm/actions/type-aliases/dumpstatejsonrpcprocedure) - Returns the state of the VM
- [`tevm_loadState`](/reference/tevm/actions/type-aliases/loadstatejsonrpcprocedure) - Initializes the state of the VM

## Eth methods

Tevm plans on implementing most of the [ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc) spec

- [`eth_accounts'](/reference/tevm/actions/type-aliases/ethaccountsjsonrpcprocedure) - Uses the same test accounts ganache anvil and hardhat uses. Mnemonic: test test test test test test test test test test test junk
- [`eth_call'](/reference/tevm/actions/type-aliases/ethcalljsonrpcprocedure)
- [`eth_chainId'](/reference/tevm/actions/type-aliases/ethchainidjsonrpcprocedure)
- [`eth_estimateGas'](/reference/tevm/actions/type-aliases/ethestimategasjsonrpcprocedure)
- [`eth_gasPrice'](/reference/tevm/actions/type-aliases/ethgaspricejsonrpcprocedure)
- [`eth_getBalance'](/reference/tevm/actions/type-aliases/ethgetbalancejsonrpcprocedure)
- [`eth_getCode'](/reference/tevm/actions/type-aliases/ethgetcodejsonrpcprocedure)
- [`eth_getStorageAt'](/reference/tevm/actions/type-aliases/ethgetcodejsonrpcprocedure)
- [`eth_getTransactionReceipt'](/reference/tevm/actions/type-aliases/ethgettransactionreceiptjsonrpcprocedure)
- [`eth_sign'](/reference/tevm/actions/type-aliases/ethsignjsonrpcprocedure)
- [`eth_signTransaction'](/reference/tevm/actions/type-aliases/ethsigntransactionjsonrpcprocedure)
- [`eth_getLogs'](/reference/tevm/actions/type-aliases/ethgetlogsjsonrpcprocedure)
- [`eth_coinbase'](/reference/tevm/actions/type-aliases/ethcoinbasejsonrpcprocedure)
- [`eth_hashrate'](/reference/tevm/actions/type-aliases/ethhashratejsonrpcprocedure)
- [`eth_protocolVersion'](/reference/tevm/actions/type-aliases/ethprotocolversionjsonrpcprocedure)
- [`eth_sendTransaction'](/reference/tevm/actions/type-aliases/ethsendtransactionjsonrpcprocedure)
- [`eth_sendRawTransaction'](/reference/tevm/actions/type-aliases/ethsendrawtransactionjsonrpcprocedure)
- [`eth_uninstallFilter'](/reference/tevm/actions/type-aliases/ethuninstallfilterjsonrpcprocedure)
- [`eth_getBlockByNumber'](/reference/tevm/actions/type-aliases/ethgetblockbynumberjsonrpcprocedure)
- [`eth_getFilterChanges'](/reference/tevm/actions/type-aliases/ethgetfilterchangesjsonrpcprocedure)
- [`eth_newFilter'](/reference/tevm/actions/type-aliases/ethnewfilterjsonrpcprocedure)
- [`eth_getFilterLogs'](/reference/tevm/actions/type-aliases/ethgetfilterlogsjsonrpcprocedure)
- [`eth_getBlockByHash'](/reference/tevm/actions/type-aliases/ethgetblockbyhashjsonrpcprocedure)
- [`eth_newBlockFilter'](/reference/tevm/actions/type-aliases/ethnewblockfilterjsonrpcprocedure)
- [`eth_getTransactionCount'](/reference/tevm/actions/type-aliases/ethgettransactioncountjsonrpcprocedure)
- [`eth_getTransactionByHash'](/reference/tevm/actions/type-aliases/ethgettransactionbyhashjsonrpcprocedure)
- [`eth_newPendingTransactionFilter'](/reference/tevm/actions/type-aliases/ethnewpendingtransactionfilterjsonrpcresponse)
- [`eth_getBlockTransactionCountByHash'](/reference/tevm/actions/type-aliases/ethgetblocktransactioncountbyhashjsonrpcprocedure)
- `eth_getBlockTransactionCountByNumber'
- [`eth_getTransactionByBlockHashAndIndex'](/reference/tevm/actions/type-aliases/ethgettransactionbyblockhashandindexjsonrpcprocedure)
- `eth_getTransactionByBlockNumberAndIndex'

## Debug methods

- [`debug_traceCall`](/reference/tevm/actions/type-aliases/debugtracecallprocedure)
- [`debug_traceTransaction`](/reference/tevm/actions/type-aliases/debugtracetransactionprocedure)

## Anvil/Hardhat methods

Anvil/hardhat methods are provided for compatability

- [`anvil_setCode'](/reference/tevm/actions/type-aliases/anvilsetcodeprocedure)
- [`anvil_setNonce'](/reference/tevm/actions/type-aliases/anvilsetnonceprocedure)
- [`anvil_setBalance'](/reference/tevm/actions/type-aliases/anvilsetbalanceprocedure)
- [`anvil_setChainId'](/reference/tevm/actions/type-aliases/anvilsetchainidprocedure)
- [`anvil_mine'](/reference/tevm/actions/type-aliases/anvilmineprocedure)
- [`anvil_getAutomine'](/reference/tevm/actions/type-aliases/anvilgetautomineprocedure) (currently always false)
- [`anvil_setStorageAt'](/reference/tevm/actions/type-aliases/anvilsetstorageatprocedure)
- [`anvil_reset'](/reference/tevm/actions/type-aliases/anvilresetprocedure)
- [`anvil_dumpState'](/reference/tevm/actions/type-aliases/anvildumpstateprocedure)
- [`anvil_loadState'](/reference/tevm/actions/type-aliases/anvilloadstateprocedure)
- [`anvil_dropTransaction'](/reference/tevm/actions/type-aliases/anvildroptransactionprocedure) (only supports dropping unmined tx atm)
- [`anvil_impersonateAccount'](/reference/tevm/actions/type-aliases/anvilimpersonateaccountprocedure) (Can only impersonate one account at a time atm0
- [`anvil_stopImpersonatingAccount'](/reference/tevm/actions/type-aliases/anvilstopimpersonatingaccountprocedure)

## Wallet methods

Tevm does not support any [wallet apis](https://docs.metamask.io/wallet/concepts/wallet-api/) at this time as it operates more like an RPC provider than a wallet node.
