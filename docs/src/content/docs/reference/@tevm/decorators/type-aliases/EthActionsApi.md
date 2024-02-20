---
editUrl: false
next: false
prev: false
title: "EthActionsApi"
---

> **EthActionsApi**: `object`

Standard JSON-RPC methods for interacting with the VM

## See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

## Type declaration

### eth

> **eth**: `object`

Standard JSON-RPC methods for interacting with the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

### eth.blockNumber

> **eth.blockNumber**: [`EthBlockNumberHandler`](/reference/tevm/actions-types/type-aliases/ethblocknumberhandler/)

Returns the current block number
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

### eth.call

> **eth.call**: [`EthCallHandler`](/reference/tevm/actions-types/type-aliases/ethcallhandler/)

Executes a call without modifying the state
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const res = await tevm.eth.call({to: '0x123...', data: '0x123...'})
console.log(res) // "0x..."
```

### eth.chainId

> **eth.chainId**: [`EthChainIdHandler`](/reference/tevm/actions-types/type-aliases/ethchainidhandler/)

Returns the current chain id
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const chainId = await tevm.eth.chainId()
console.log(chainId) // 10n
```

### eth.gasPrice

> **eth.gasPrice**: [`EthGasPriceHandler`](/reference/tevm/actions-types/type-aliases/ethgaspricehandler/)

Returns the current gas price
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const gasPrice = await tevm.eth.gasPrice()
console.log(gasPrice) // 0n
```

### eth.getBalance

> **eth.getBalance**: [`EthGetBalanceHandler`](/reference/tevm/actions-types/type-aliases/ethgetbalancehandler/)

Returns the balance of a given address
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'})
console.log(gasPrice) // 0n
```

### eth.getCode

> **eth.getCode**: [`EthGetCodeHandler`](/reference/tevm/actions-types/type-aliases/ethgetcodehandler/)

Returns code at a given address
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const code = await tevm.eth.getCode({address: '0x123...'})
```

### eth.getStorageAt

> **eth.getStorageAt**: [`EthGetStorageAtHandler`](/reference/tevm/actions-types/type-aliases/ethgetstorageathandler/)

Returns storage at a given address and slot
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})
```

## Source

[EthActionsApi.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/EthActionsApi.ts#L15)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
