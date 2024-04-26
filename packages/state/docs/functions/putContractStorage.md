**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > putContractStorage

# Function: putContractStorage()

> **putContractStorage**(`baseState`): (`address`, `key`, `value`) => `Promise`\<`void`\>

Adds value to the cache for the `account`
corresponding to `address` at the provided `key`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is empty or filled with zeros, deletes the value.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`, `key`, `value`): `Promise`\<`void`\>
>
> ### Parameters
>
> ▪ **address**: `Address`
>
> ▪ **key**: `Uint8Array`
>
> ▪ **value**: `Uint8Array`
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60
>

## Source

[packages/state/src/actions/putContractStorage.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/putContractStorage.js#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
