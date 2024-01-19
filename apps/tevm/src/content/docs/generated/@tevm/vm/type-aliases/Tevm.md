---
editUrl: false
next: false
prev: false
title: "Tevm"
---

> **Tevm**: `Tevm` & `object`

A local EVM instance running in JavaScript. Similar to Anvil in your browser

## Example

```ts
import { createTevm } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = createTevm({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.contract(
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

## Type declaration

### \_evm

> **`readonly`** **\_evm**: `TevmEvm`

Internal instance of the EVM. Can be used for lower level operations
but is not guaranteed to stay stable between versions

### \_vm

> **`readonly`** **\_vm**: `VM`

Internal instance of the VM. Can be used for lower level operations
but is not guaranteed to stay stable between versions

### forkUrl

> **`readonly`** **forkUrl**?: `string`

Fork url if the EVM is forked

## Source

[vm/vm/src/Tevm.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/Tevm.ts#L35)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
