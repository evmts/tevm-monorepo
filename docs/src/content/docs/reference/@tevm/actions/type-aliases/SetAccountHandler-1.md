---
editUrl: false
next: false
prev: false
title: "SetAccountHandler"
---

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](/reference/tevm/actions/type-aliases/setaccountresult-1/)\>

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

• **params**: [`SetAccountParams`](/reference/tevm/actions/type-aliases/setaccountparams-1/)

## Returns

`Promise`\<[`SetAccountResult`](/reference/tevm/actions/type-aliases/setaccountresult-1/)\>

## Source

[packages/actions/src/SetAccount/SetAccountHandlerType.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/SetAccountHandlerType.ts#L15)
