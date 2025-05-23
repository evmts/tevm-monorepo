[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EthActionsApi

# Type Alias: EthActionsApi

> **EthActionsApi** = `object`

Defined in: packages/decorators/dist/index.d.ts:11

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)
These actions correspond 1:1 eith the public ethereum JSON-RPC api

## See

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

## Properties

### eth

> **eth**: `object`

Defined in: packages/decorators/dist/index.d.ts:16

Standard JSON-RPC methods for interacting with the VM

#### blockNumber

> **blockNumber**: [`EthBlockNumberHandler`](../../actions/type-aliases/EthBlockNumberHandler.md)

Returns the current block number
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

#### call

> **call**: [`EthCallHandler`](../../actions/type-aliases/EthCallHandler.md)

Executes a call without modifying the state
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const res = await tevm.eth.call({to: '0x123...', data: '0x123...'})
console.log(res) // "0x..."
```

#### chainId

> **chainId**: [`EthChainIdHandler`](../../actions/type-aliases/EthChainIdHandler.md)

Returns the current chain id
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const chainId = await tevm.eth.chainId()
console.log(chainId) // 10n
```

#### gasPrice

> **gasPrice**: [`EthGasPriceHandler`](../../actions/type-aliases/EthGasPriceHandler.md)

Returns the current gas price
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const gasPrice = await tevm.eth.gasPrice()
console.log(gasPrice) // 0n
```

#### getBalance

> **getBalance**: [`EthGetBalanceHandler`](../../actions/type-aliases/EthGetBalanceHandler.md)

Returns the balance of a given address
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'})
console.log(gasPrice) // 0n
```

#### getCode

> **getCode**: [`EthGetCodeHandler`](../../actions/type-aliases/EthGetCodeHandler.md)

Returns code at a given address
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const code = await tevm.eth.getCode({address: '0x123...'})
```

#### getStorageAt

> **getStorageAt**: [`EthGetStorageAtHandler`](../../actions/type-aliases/EthGetStorageAtHandler.md)

Returns storage at a given address and slot
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

##### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

##### Example

```ts
const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})
```

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)
