[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Classes

- [Tevm](undefined)

### Type Aliases

- [Client](undefined)
- [CreateEVMOptions](undefined)

### Functions

- [createClient](undefined)

## Classes

### Tevm

• **Tevm**: Class Tevm

A local EVM instance running in JavaScript. Similar to Anvil in your browser

**`Example`**

```ts
import { Tevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = Tevm.create({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.runContractCall(
  MyERC721.write.mint({
    caller: address,
  }),
)

const balance = await tevm.runContractCall(
 MyERC721.read.balanceOf({
 caller: address,
 }),
 )
 console.log(balance) // 1n
 ```

#### Defined in

[tevm.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L105)

## Type Aliases

### Client

Ƭ **Client**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `putAccount` | Method putAccount |
| `putContractCode` | Method putContractCode |
| `request` | Method request |
| `runCall` | Method runCall |
| `runContractCall` | Method runContractCall |
| `runScript` | Method runScript |

#### Defined in

[client/createClient.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/client/createClient.ts#L17)

___

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customPrecompiles?` | CustomPrecompile[] |
| `fork?` | ForkOptions |

#### Defined in

[tevm.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/tevm.ts#L47)

## Functions

### createClient

▸ **createClient**(`rpcUrl`): Client

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | string |

#### Returns

Client

#### Defined in

[client/createClient.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/client/createClient.ts#L38)
