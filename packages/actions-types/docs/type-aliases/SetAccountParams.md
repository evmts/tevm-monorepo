**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > SetAccountParams

# Type alias: SetAccountParams

> **SetAccountParams**: `object`

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

> **address**: `Address`

Address of account

### balance

> **balance**?: `bigint`

Balance to set account to

### deployedBytecode

> **deployedBytecode**?: `Hex`

Contract bytecode to set account to

### nonce

> **nonce**?: `bigint`

Nonce to set account to

### storageRoot

> **storageRoot**?: `Hex`

Storage root to set account to

## Source

[params/SetAccountParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-types/src/params/SetAccountParams.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
