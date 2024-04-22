**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > getContractStorage

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
> ▪ **address**: `Address`
>
> ▪ **key**: `Uint8Array`
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59
>

## Source

[packages/state/src/actions/getContractStorage.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractStorage.js#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
