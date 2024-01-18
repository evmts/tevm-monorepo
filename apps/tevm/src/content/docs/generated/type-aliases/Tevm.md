---
editUrl: false
next: false
prev: false
title: "Tevm"
---

> **Tevm**: `object`

The specification for the Tevm api
It has a request method for JSON-RPC requests and more ergonomic handler methods
for each type of request

## Type declaration

### account

> **account**: [`AccountHandler`](/generated/type-aliases/accounthandler/)

### call

> **call**: [`CallHandler`](/generated/type-aliases/callhandler/)

### contract

> **contract**: [`ContractHandler`](/generated/type-aliases/contracthandler/)

### eth

> **eth**: `object`

### eth.blockNumber

> **eth.blockNumber**: [`EthBlockNumberHandler`](/generated/type-aliases/ethblocknumberhandler/)

### eth.chainId

> **eth.chainId**: [`EthChainIdHandler`](/generated/type-aliases/ethchainidhandler/)

### eth.gasPrice

> **eth.gasPrice**: [`EthGasPriceHandler`](/generated/type-aliases/ethgaspricehandler/)

### eth.getBalance

> **eth.getBalance**: [`EthGetBalanceHandler`](/generated/type-aliases/ethgetbalancehandler/)

### eth.getCode

> **eth.getCode**: [`EthGetCodeHandler`](/generated/type-aliases/ethgetcodehandler/)

### eth.getStorageAt

> **eth.getStorageAt**: [`EthGetStorageAtHandler`](/generated/type-aliases/ethgetstorageathandler/)

### request

> **request**: [`TevmJsonRpcRequestHandler`](/generated/type-aliases/tevmjsonrpcrequesthandler/)

### script

> **script**: [`ScriptHandler`](/generated/type-aliases/scripthandler/)

## Source

[Tevm.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/Tevm.ts#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
