[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / setIteratorHead

# Function: setIteratorHead()

> **setIteratorHead**(`baseChain`): (`tag`, `headHash`) => `Promise`\<`void`\>

Defined in: packages/blockchain/types/actions/setIteratorHead.d.ts:1

## Parameters

### baseChain

`BaseChain`

## Returns

`Function`

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

### Parameters

#### tag

`string`

The tag to save the headHash to

#### headHash

`Uint8Array`

The head hash to save

### Returns

`Promise`\<`void`\>
