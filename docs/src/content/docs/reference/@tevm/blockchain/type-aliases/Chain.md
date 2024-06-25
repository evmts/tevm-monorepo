---
editUrl: false
next: false
prev: false
title: "Chain"
---

> **Chain**: `object` & `BaseChain` & `object`

Blockchain

## Type declaration

### consensus

> **consensus**: `Consensus`

### deepCopy()

> **deepCopy**: () => `Promise`\<[`Chain`](/reference/tevm/blockchain/type-aliases/chain/)\>

#### Returns

`Promise`\<[`Chain`](/reference/tevm/blockchain/type-aliases/chain/)\>

### events?

> `optional` **events**: [`AsyncEventEmitter`](/reference/tevm/utils/classes/asynceventemitter/)\<`BlockchainEvents`\>

Optional events emitter

### shallowCopy()

> **shallowCopy**: () => [`Chain`](/reference/tevm/blockchain/type-aliases/chain/)

Returns a shallow copy of the blockchain that may share state with the original

#### Returns

[`Chain`](/reference/tevm/blockchain/type-aliases/chain/)

### delBlock()

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

#### Parameters

• **blockHash**: `Uint8Array`

The hash of the block to be deleted

#### Returns

`Promise`\<`void`\>

### getBlock()

Returns a block by its hash or number.

#### Parameters

• **blockId**: `number` \| `bigint` \| `Uint8Array`

#### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

### getCanonicalHeadBlock()

Returns the latest full block in the canonical chain.

#### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

### getIteratorHead()

Returns the specified iterator head.

#### Parameters

• **name?**: `string`

Optional name of the iterator head (default: 'vm')

#### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

### getTotalDifficulty()?

Gets total difficulty for a block specified by hash and number

#### Parameters

• **hash**: `Uint8Array`

• **number?**: `bigint`

#### Returns

`Promise`\<`bigint`\>

### iterator()

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block.

#### Parameters

• **name**: `string`

Name of the state root head

• **onBlock**: `OnBlock`

Function called on each block with params (block: Block,

• **maxBlocks?**: `number`

optional maximum number of blocks to iterate through
reorg: boolean)

• **releaseLockOnCallback?**: `boolean`

#### Returns

`Promise`\<`number`\>

### putBlock()

Adds a block to the blockchain.

#### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

The block to be added to the blockchain.

#### Returns

`Promise`\<`void`\>

### setIteratorHead()

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

• **tag**: `string`

The tag to save the headHash to

• **headHash**: `Uint8Array`

The head hash to save

#### Returns

`Promise`\<`void`\>

### validateHeader()

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

#### Parameters

• **header**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

header to be validated

• **height?**: `bigint`

If this is an uncle header, this is the height of the block that is including it

#### Returns

`Promise`\<`void`\>

## Defined in

[Chain.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L16)
