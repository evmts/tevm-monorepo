[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / CallParams

# Type alias: CallParams\<TThrowOnFail\>

> **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

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

> `optional` `readonly` **data**: [`Hex`](Hex.md)

The input data.

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](Hex.md)

The EVM code to run.

### salt?

> `optional` `readonly` **salt**: [`Hex`](Hex.md)

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[params/CallParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/CallParams.ts#L16)
