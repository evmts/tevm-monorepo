[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Classes

- [NoProxyConfiguredError](classes/NoProxyConfiguredError.md)
- [ProxyFetchError](classes/ProxyFetchError.md)
- [UnexpectedInternalServerError](classes/UnexpectedInternalServerError.md)

### Type Aliases

- [CreateEVMOptions](modules.md#createevmoptions)
- [CustomPrecompile](modules.md#customprecompile)
- [ForkOptions](modules.md#forkoptions)
- [Tevm](modules.md#tevm)

### Functions

- [createTevm](modules.md#createtevm)

## Type Aliases

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` |
| `customPrecompiles?` | [`CustomPrecompile`](modules.md#customprecompile)[] |
| `customPredeploys?` | `ReadonlyArray`\<`CustomPredeploy`\<`any`, `any`, `any`, `any`\>\> |
| `fork?` | [`ForkOptions`](modules.md#forkoptions) |

#### Defined in

[vm/vm/src/CreateEVMOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/CreateEVMOptions.ts#L8)

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<`ConstructorArgument`\<`EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

TODO This should be publically exported from ethereumjs but isn't
Typing this by hand is tedious so we are using some typescript inference to get it
do a pr to export this from ethereumjs and then replace this with an import
TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm

#### Defined in

[vm/vm/src/CustomPrecompile.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/CustomPrecompile.ts#L16)

___

### ForkOptions

Ƭ **ForkOptions**: `Object`

Options fetch state that isn't available locally.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockTag?` | `bigint` | The block tag to use for the EVM. If not passed it will start from the latest block at the time of forking |
| `url` | `string` | A viem PublicClient to use for the EVM. It will be used to fetch state that isn't available locally. |

#### Defined in

[vm/vm/src/ForkOptions.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/ForkOptions.ts#L4)

___

### Tevm

Ƭ **Tevm**: `Tevm` & \{ `_evm`: `TevmEvm` ; `forkUrl?`: `string`  }

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

[vm/vm/src/Tevm.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L34)

## Functions

### createTevm

▸ **createTevm**(`options?`): `Promise`\<[`Tevm`](modules.md#tevm)\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CreateEVMOptions`](modules.md#createevmoptions) |

#### Returns

`Promise`\<[`Tevm`](modules.md#tevm)\>

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

[vm/vm/src/createTevm.js:45](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/createTevm.js#L45)
