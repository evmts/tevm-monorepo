[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Type Aliases

- [Client](undefined)
- [CreateEVMOptions](undefined)
- [Tevm](undefined)

### Functions

- [createClient](undefined)
- [createTevm](undefined)

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

Tevm.ts:38

___

### Tevm

Ƭ **Tevm**: `Object`

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

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `_evm` | EVM | Internal instance of the EVM. Can be used for lower level operations but is not guaranteed to stay stable between versions |
| `createHttpHandler` | Function | - |
| `createJsonrpcClient` | Function | - |
| `putAccount` | Function | - |
| `putContractCode` | Function | - |
| `request` | Function | - |
| `runCall` | Function | - |
| `runContractCall` | Function | - |
| `runScript` | Function | - |

#### Defined in

Tevm.ts:96

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

___

### createTevm

▸ **createTevm**(`options?`): Promise\<Tevm\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | CreateEVMOptions |

#### Returns

Promise\<Tevm\>

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

[createTevm.js:47](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/createTevm.js#L47)
