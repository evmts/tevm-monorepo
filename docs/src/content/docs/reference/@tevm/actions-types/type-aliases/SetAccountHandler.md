---
editUrl: false
next: false
prev: false
title: "SetAccountHandler"
---

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](/reference/tevm/actions-types/type-aliases/setaccountresult/)\>

Sets the state of a specific ethereum address

## Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```

## Parameters

• **params**: [`SetAccountParams`](/reference/tevm/actions-types/type-aliases/setaccountparams/)

## Returns

`Promise`\<[`SetAccountResult`](/reference/tevm/actions-types/type-aliases/setaccountresult/)\>

## Source

[handlers/SetAccountHandler.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/SetAccountHandler.ts#L14)
