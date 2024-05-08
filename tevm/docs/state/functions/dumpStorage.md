**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > dumpStorage

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
> ▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
>
> ### Source
>
> node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77
>

## Source

packages/state/dist/index.d.ts:226

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
