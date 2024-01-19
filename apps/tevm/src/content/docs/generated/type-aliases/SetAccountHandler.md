---
editUrl: false
next: false
prev: false
title: "SetAccountHandler"
---

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](/generated/type-aliases/setaccountresult/)\>

Sets the state of a specific ethereum address

## Parameters

▪ **params**: [`SetAccountParams`](/generated/type-aliases/setaccountparams/)

## Returns

## Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```

## Source

[handlers/SetAccountHandler.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/SetAccountHandler.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
