**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > putContractStorage

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
> ▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
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

packages/state/dist/index.d.ts:311

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
