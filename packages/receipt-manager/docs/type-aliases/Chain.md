**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Chain

# Type alias: Chain

> **Chain**: `object` & `BaseChain` & `object`

Blockchain

## Type declaration

## Type declaration

### consensus

> **consensus**: `Consensus`

### deepCopy

> **deepCopy**: () => `Promise`\<[`Chain`](Chain.md)\>

### events

> **events**?: `AsyncEventEmitter`\<`BlockchainEvents`\>

Optional events emitter

### shallowCopy

> **shallowCopy**: () => [`Chain`](Chain.md)

Returns a shallow copy of the blockchain that may share state with the original

### delBlock()

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

#### Parameters

▪ **blockHash**: `Uint8Array`

The hash of the block to be deleted

### getBlock()

Returns a block by its hash or number.

#### Parameters

▪ **blockId**: `number` \| `bigint` \| `Uint8Array`

### getCanonicalHeadBlock()

Returns the latest full block in the canonical chain.

### getIteratorHead()

Returns the specified iterator head.

#### Parameters

▪ **name?**: `string`

Optional name of the iterator head (default: 'vm')

### getTotalDifficulty()

Gets total difficulty for a block specified by hash and number

#### Parameters

▪ **hash**: `Uint8Array`

▪ **number?**: `bigint`

### iterator()

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

▪ **name**: `string`

Name of the state root head

▪ **onBlock**: `OnBlock`

Function called on each block with params (block: Block,

▪ **maxBlocks?**: `number`

optional maximum number of blocks to iterate through
reorg: boolean)

▪ **releaseLockOnCallback?**: `boolean`

### putBlock()

Adds a block to the blockchain.

#### Parameters

▪ **block**: `Block`

The block to be added to the blockchain.

### setIteratorHead()

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

▪ **tag**: `string`

The tag to save the headHash to

▪ **headHash**: `Uint8Array`

The head hash to save

### validateHeader()

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

#### Parameters

▪ **header**: `BlockHeader`

header to be validated

▪ **height?**: `bigint`

If this is an uncle header, this is the height of the block that is including it

## Source

[Chain.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
