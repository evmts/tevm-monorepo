**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > setIteratorHead

# Function: setIteratorHead()

> **setIteratorHead**(`baseChain`): (`tag`, `headHash`) => `Promise`\<`void`\>

## Parameters

▪ **baseChain**: `BaseChain`

## Returns

> > (`tag`, `headHash`): `Promise`\<`void`\>
>
> Set header hash of a certain `tag`.
> When calling the iterator, the iterator will start running the first child block after the header hash currently stored.
>
> ### Parameters
>
> ▪ **tag**: `string`
>
> The tag to save the headHash to
>
> ▪ **headHash**: `Uint8Array`
>
> The head hash to save
>
> ### Source
>
> [Chain.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L75)
>

## Source

[actions/setIteratorHead.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/setIteratorHead.js#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
