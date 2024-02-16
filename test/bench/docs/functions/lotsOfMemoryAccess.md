**@tevm/bench** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > lotsOfMemoryAccess

# Function: lotsOfMemoryAccess()

> **lotsOfMemoryAccess**(`rpcUrl`, `ids`): `Promise`\<`ContractResult`\<(`object` \| `object` \| `object` \| `object`)[], `"batchMint"`\>\>

initialize a brand new tevm client and then execute a call with lots of storage requirements. This is similar to how one might use tevm in a serverless function where tevm is reinitialized often

## Parameters

▪ **rpcUrl**: `string`

▪ **ids**: `number`[]= `undefined`

## Source

[lotsOfMemoryAccess/lotsOfMemoryAccess.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/test/bench/src/lotsOfMemoryAccess/lotsOfMemoryAccess.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
