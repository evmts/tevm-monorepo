[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CallParams

# Type alias: CallParams\<TThrowOnFail\>

> **CallParams**\<`TThrowOnFail`\>: `BaseCallParams`\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on the vm
Call is the lowest level method to interact with the vm
and other messages such as contract and script are using call
under the hood

## Example

```ts
const callParams: import('@tevm/api').CallParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}
```

## Type declaration

### code?

> `optional` `readonly` **code**: `Hex`

The encoded code to deploy with for a deployless call

### data?

> `optional` `readonly` **data**: `Hex`

The input data.

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: `Hex`

THe code to put into the state before executing call. If you wish to call the constructor
use `code` instead.

### salt?

> `optional` `readonly` **salt**: `Hex`

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions/types/Call/CallParams.d.ts:15
