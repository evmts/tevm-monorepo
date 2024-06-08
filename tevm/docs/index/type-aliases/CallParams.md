[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CallParams

# Type alias: CallParams\<TThrowOnFail\>

> **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](../../actions-types/type-aliases/BaseCallParams.md)\<`TThrowOnFail`\> & `object`

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

### data?

> `optional` `readonly` **data**: [`Hex`](../../actions-types/type-aliases/Hex.md)

The input data.

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](../../actions-types/type-aliases/Hex.md)

The EVM code to run.

### salt?

> `optional` `readonly` **salt**: [`Hex`](../../actions-types/type-aliases/Hex.md)

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions-types/types/params/CallParams.d.ts:15
