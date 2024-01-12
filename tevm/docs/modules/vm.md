[tevm](../README.md) / [Modules](../modules.md) / vm

# Module: vm

## Table of contents

### References

- [createTevm](vm.md#createtevm)

### Type Aliases

- [CreateEVMOptions](vm.md#createevmoptions)
- [CustomPrecompile](vm.md#customprecompile)
- [ForkOptions](vm.md#forkoptions)
- [Tevm](vm.md#tevm)

## References

### createTevm

Re-exports [createTevm](index.md#createtevm)

## Type Aliases

### CreateEVMOptions

Ƭ **CreateEVMOptions**: `Object`

Options for creating an Tevm instance

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowUnlimitedContractSize?` | `boolean` |
| `customPrecompiles?` | [`CustomPrecompile`](vm.md#customprecompile)[] |
| `customPredeploys?` | `ReadonlyArray`\<`CustomPredeploy`\<`any`, `any`, `any`, `any`\>\> |
| `fork?` | [`ForkOptions`](vm.md#forkoptions) |

#### Defined in

vm/vm/dist/index.d.ts:84

___

### CustomPrecompile

Ƭ **CustomPrecompile**: `Exclude`\<`Exclude`\<`ConstructorArgument`\<typeof `_ethereumjs_evm.EVM`\>, `undefined`\>[``"customPrecompiles"``], `undefined`\>[`number`]

TODO This should be publically exported from ethereumjs but isn't
Typing this by hand is tedious so we are using some typescript inference to get it
do a pr to export this from ethereumjs and then replace this with an import
TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm

#### Defined in

vm/vm/dist/index.d.ts:62

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

vm/vm/dist/index.d.ts:67

___

### Tevm

Ƭ **Tevm**: [`Tevm`](api.md#tevm) & \{ `_evm`: `TevmEvm` ; `forkUrl?`: `string`  }

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

vm/vm/dist/index.d.ts:37
