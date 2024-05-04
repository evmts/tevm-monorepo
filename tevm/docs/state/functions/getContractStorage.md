**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > getContractStorage

# Function: getContractStorage()

> **getContractStorage**(`baseState`): (`address`, `key`) => `Promise`\<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`, `key`): `Promise`\<`Uint8Array`\>
>
> ### Parameters
>
> ▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
>
> ▪ **key**: `Uint8Array`
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59
>

## Source

packages/state/dist/index.d.ts:255

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
