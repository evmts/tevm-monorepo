[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SetAccountHandler

# Type Alias: SetAccountHandler()

> **SetAccountHandler** = (`params`) => `Promise`\<[`SetAccountResult`](SetAccountResult.md)\>

Defined in: packages/actions/types/SetAccount/SetAccountHandlerType.d.ts:14

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
