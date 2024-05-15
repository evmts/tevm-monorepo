**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > delBlock

# Function: delBlock()

> **delBlock**(`baseChain`): (`blockHash`) => `Promise`\<`void`\>

## Parameters

▪ **baseChain**: `BaseChain`

## Returns

> > (`blockHash`): `Promise`\<`void`\>
>
> Deletes a block from the blockchain. All child blocks in the chain are
> deleted and any encountered heads are set to the parent block.
>
> ### Parameters
>
> ▪ **blockHash**: `Uint8Array`
>
> The hash of the block to be deleted
>
> ### Source
>
> [Chain.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L37)
>

## Source

[actions/delBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/delBlock.js#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
