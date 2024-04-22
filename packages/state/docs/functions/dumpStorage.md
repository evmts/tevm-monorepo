**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > dumpStorage

# Function: dumpStorage()

> **dumpStorage**(`baseState`): (`address`) => `Promise`\<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

## Parameters

▪ **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

> > (`address`): `Promise`\<`StorageDump`\>
>
> ### Parameters
>
> ▪ **address**: `Address`
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77
>

## Source

[packages/state/src/actions/dumpStorage.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorage.js#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
