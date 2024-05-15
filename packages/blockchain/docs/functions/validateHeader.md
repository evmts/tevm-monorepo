**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > validateHeader

# Function: validateHeader()

> **validateHeader**(`baseChain`): (`header`, `height`?) => `Promise`\<`void`\>

## Parameters

▪ **baseChain**: `BaseChain`

## Returns

> > (`header`, `height`?): `Promise`\<`void`\>
>
> Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.
>
> ### Parameters
>
> ▪ **header**: `BlockHeader`
>
> header to be validated
>
> ▪ **height?**: `bigint`
>
> If this is an uncle header, this is the height of the block that is including it
>
> ### Source
>
> [Chain.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L60)
>

## Source

[actions/validateHeader.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/validateHeader.js#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
