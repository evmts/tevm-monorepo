**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > SetAccountParams

# Type alias: SetAccountParams`<TThrowOnFail>`

> **SetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Tevm params to set an account in the vm state
all fields are optional except address

## Example

```ts
const accountParams: import('tevm/api').SetAccountParams = {
  account: '0x...',
  nonce: 5n,
  balance: 9000000000000n,
  storageRoot: '0x....',
  deployedBytecode: '0x....'
}
```

## Type declaration

### address

> **address**: [`Address`](Address.md)

Address of account

### balance

> **balance**?: `bigint`

Balance to set account to

### deployedBytecode

> **deployedBytecode**?: [`Hex`](Hex.md)

Contract bytecode to set account to

### nonce

> **nonce**?: `bigint`

Nonce to set account to

### state

> **state**?: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

key-value mapping to override all slots in the account storage before executing the calls

### stateDiff

> **stateDiff**?: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

key-value mapping to override individual slots in the account storage before executing the calls

### storageRoot

> **storageRoot**?: [`Hex`](Hex.md)

Storage root to set account to

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

packages/actions-types/types/params/SetAccountParams.d.ts:16

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
