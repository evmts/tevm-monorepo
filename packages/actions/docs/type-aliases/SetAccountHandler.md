[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / SetAccountHandler

# Type Alias: SetAccountHandler()

> **SetAccountHandler** = (`params`) => `Promise`\<[`SetAccountResult`](SetAccountResult.md)\>

Defined in: [packages/actions/src/SetAccount/SetAccountHandlerType.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/SetAccountHandlerType.ts#L15)

Sets the state of a specific ethereum address

## Parameters

### params

[`SetAccountParams`](SetAccountParams.md)

## Returns

`Promise`\<[`SetAccountResult`](SetAccountResult.md)\>

## Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```
