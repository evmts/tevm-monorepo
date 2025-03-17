[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SetAccountHandler

# Type Alias: SetAccountHandler()

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](../../index/type-aliases/SetAccountResult.md)\>

Defined in: packages/actions/dist/index.d.ts:2317

Sets the state of a specific ethereum address

## Parameters

### params

[`SetAccountParams`](../../index/type-aliases/SetAccountParams.md)

## Returns

`Promise`\<[`SetAccountResult`](../../index/type-aliases/SetAccountResult.md)\>

## Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```
