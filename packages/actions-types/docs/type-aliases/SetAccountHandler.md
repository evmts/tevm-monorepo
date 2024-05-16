[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / SetAccountHandler

# Type alias: SetAccountHandler()

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](SetAccountResult.md)\>

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

• **params**: [`SetAccountParams`](SetAccountParams.md)

## Returns

`Promise`\<[`SetAccountResult`](SetAccountResult.md)\>

## Source

[handlers/SetAccountHandler.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/SetAccountHandler.ts#L14)
