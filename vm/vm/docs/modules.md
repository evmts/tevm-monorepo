[@tevm/vm](README.md) / Modules

# @tevm/vm

## Table of contents

### Functions

- [createTevm](modules.md#createtevm)

## Functions

### createTevm

▸ **createTevm**(`options?`): `Promise`\<`Tevm`\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `CreateEVMOptions` |

#### Returns

`Promise`\<`Tevm`\>

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

[createTevm.js:46](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/createTevm.js#L46)
