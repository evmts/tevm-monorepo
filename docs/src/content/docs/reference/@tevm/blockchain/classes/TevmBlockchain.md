---
editUrl: false
next: false
prev: false
title: "TevmBlockchain"
---

A custom tevm wrapper around the EthereumJS Blockchain class.
This class stores and interacts with blocks.

## Extends

- `Blockchain`

## Constructors

### new TevmBlockchain(opts)

> **`protected`** **new TevmBlockchain**(`opts`?): [`TevmBlockchain`](/reference/tevm/blockchain/classes/tevmblockchain/)

Creates new Blockchain object.

:::caution[Deprecated]
The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async [Blockchain.create](/reference/tevm/blockchain/classes/tevmblockchain/#create) constructor instead (same API).
:::

#### Parameters

▪ **opts?**: `BlockchainOptions`

An object with the options that this constructor takes. See
[BlockchainOptions]([object Object]).

#### Returns

#### Inherited from

Blockchain.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:63

## Properties

### \_isInitialized

> **`protected`** **\_isInitialized**: `boolean`

#### Inherited from

Blockchain.\_isInitialized

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:32

***

### common

> **`readonly`** **common**: `Common`

#### Inherited from

Blockchain.common

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:34

***

### consensus

> **consensus**: `Consensus`

#### Inherited from

Blockchain.consensus

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:11

***

### db

> **db**: `DB`\<`string` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

#### Inherited from

Blockchain.db

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:12

***

### dbManager

> **dbManager**: `DBManager`

#### Inherited from

Blockchain.dbManager

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:13

## Accessors

### genesisBlock

> **`get`** **genesisBlock**(): [`Block`](/reference/tevm/blockchain/classes/block/)

The genesis [Block](/reference/tevm/blockchain/classes/block/) for the blockchain.

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:365

## Methods

### checkAndTransitionHardForkByNumber()

> **checkAndTransitionHardForkByNumber**(`number`, `td`?, `timestamp`?): `Promise`\<`void`\>

#### Parameters

▪ **number**: `BigIntLike`

▪ **td?**: `BigIntLike`

▪ **timestamp?**: `BigIntLike`

#### Inherited from

Blockchain.checkAndTransitionHardForkByNumber

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:350

***

### createGenesisBlock()

> **createGenesisBlock**(`stateRoot`): [`Block`](/reference/tevm/blockchain/classes/block/)

Creates a genesis [Block](/reference/tevm/blockchain/classes/block/) for the blockchain with params from [Common.genesis](/reference/tevm/common/classes/tevmcommon/#genesis)

#### Parameters

▪ **stateRoot**: `Uint8Array`

The genesis stateRoot

#### Inherited from

Blockchain.createGenesisBlock

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:370

***

### delBlock()

> **delBlock**(`blockHash`): `Promise`\<`void`\>

Completely deletes a block from the blockchain including any references to
this block. If this block was in the canonical chain, then also each child
block of this block is deleted Also, if this was a canonical block, each
head header which is part of this now stale chain will be set to the
parentHeader of this block An example reason to execute is when running the
block in the VM invalidates this block: this will then reset the canonical
head to the past block (which has been validated in the past by the VM, so
we can be sure it is correct).

#### Parameters

▪ **blockHash**: `Uint8Array`

The hash of the block to be deleted

#### Inherited from

Blockchain.delBlock

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:256

***

### getBlock()

> **getBlock**(`blockId`): `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)\>

Gets a block by its hash or number.  If a number is provided, the returned
block will be the canonical block at that number in the chain

#### Parameters

▪ **blockId**: `number` \| `bigint` \| `Uint8Array`

The block's hash or number. If a hash is provided, then
this will be immediately looked up, otherwise it will wait until we have
unlocked the DB

#### Inherited from

Blockchain.getBlock

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:219

***

### getBlocks()

> **getBlocks**(`blockId`, `maxBlocks`, `skip`, `reverse`): `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)[]\>

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

▪ **blockId**: `number` \| `bigint` \| `Uint8Array`

The block's hash or number

▪ **maxBlocks**: `number`

Max number of blocks to return

▪ **skip**: `number`

Number of blocks to skip apart

▪ **reverse**: `boolean`

Fetch blocks in reverse

#### Inherited from

Blockchain.getBlocks

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:237

***

### getCanonicalHeadBlock()

> **getCanonicalHeadBlock**(): `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)\>

Returns the latest full block in the canonical chain.

#### Inherited from

Blockchain.getCanonicalHeadBlock

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:119

***

### getCanonicalHeadHeader()

> **getCanonicalHeadHeader**(): `Promise`\<`BlockHeader`\>

Returns the latest header in the canonical chain.

#### Inherited from

Blockchain.getCanonicalHeadHeader

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:115

***

### getCanonicalHeader()

> **getCanonicalHeader**(`number`): `Promise`\<`BlockHeader`\>

Gets a header by number. Header must be in the canonical chain

#### Parameters

▪ **number**: `bigint`

#### Inherited from

Blockchain.getCanonicalHeader

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:354

***

### getIteratorHead()

> **getIteratorHead**(`name`?): `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)\>

Returns the specified iterator head.

This function replaces the old Blockchain.getHead() method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of [Blockchain.iterator](/reference/tevm/blockchain/classes/tevmblockchain/#iterator).

#### Parameters

▪ **name?**: `string`

Optional name of the iterator head (default: 'vm')

#### Inherited from

Blockchain.getIteratorHead

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:104

***

### getIteratorHeadSafe()

> **getIteratorHeadSafe**(`name`?): `Promise`\<`undefined` \| [`Block`](/reference/tevm/blockchain/classes/block/)\>

This method differs from `getIteratorHead`. If the head is not found, it returns `undefined`.

#### Parameters

▪ **name?**: `string`

Optional name of the iterator head (default: 'vm')

#### Returns

#### Inherited from

Blockchain.getIteratorHeadSafe

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:110

***

### getParentTD()

> **getParentTD**(`header`): `Promise`\<`bigint`\>

Gets total difficulty for a header's parent, helpful for determining terminal block

#### Parameters

▪ **header**: `BlockHeader`

Block header whose parent td is desired

#### Inherited from

Blockchain.getParentTD

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:228

***

### getTotalDifficulty()

> **getTotalDifficulty**(`hash`, `number`?): `Promise`\<`bigint`\>

Gets total difficulty for a block specified by hash and number

#### Parameters

▪ **hash**: `Uint8Array`

▪ **number?**: `bigint`

#### Inherited from

Blockchain.getTotalDifficulty

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:223

***

### iterator()

> **iterator**(`name`, `onBlock`, `maxBlocks`?, `releaseLockOnCallback`?): `Promise`\<`number`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using [Blockchain.getIteratorHead](/reference/tevm/blockchain/classes/tevmblockchain/#getiteratorhead).

#### Parameters

▪ **name**: `string`

Name of the state root head

▪ **onBlock**: `OnBlock`

Function called on each block with params (block, reorg)

▪ **maxBlocks?**: `number`

How many blocks to run. By default, run all unprocessed blocks in the canonical chain.

▪ **releaseLockOnCallback?**: `boolean`

Do not lock the blockchain for running the callback (default: `false`)

#### Returns

number of blocks actually iterated

#### Inherited from

Blockchain.iterator

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:288

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

Adds a block to the blockchain.

If the block is valid and has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

▪ **block**: [`Block`](/reference/tevm/blockchain/classes/block/)

The block to be added to the blockchain

#### Inherited from

Blockchain.putBlock

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:138

***

### putBlocks()

> **putBlocks**(`blocks`): `Promise`\<`void`\>

Adds blocks to the blockchain.

If an invalid block is met the function will throw, blocks before will
nevertheless remain in the DB. If any of the saved blocks has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

▪ **blocks**: [`Block`](/reference/tevm/blockchain/classes/block/)[]

The blocks to be added to the blockchain

#### Inherited from

Blockchain.putBlocks

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:129

***

### putHeader()

> **putHeader**(`header`): `Promise`\<`void`\>

Adds a header to the blockchain.

If this header is valid and it has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

▪ **header**: `BlockHeader`

The header to be added to the blockchain

#### Inherited from

Blockchain.putHeader

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:157

***

### putHeaders()

> **putHeaders**(`headers`): `Promise`\<`void`\>

Adds many headers to the blockchain.

If an invalid header is met the function will throw, headers before will
nevertheless remain in the DB. If any of the saved headers has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

▪ **headers**: `any`[]

The headers to be added to the blockchain

#### Inherited from

Blockchain.putHeaders

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:148

***

### resetCanonicalHead()

> **resetCanonicalHead**(`canonicalHead`): `Promise`\<`void`\>

Resets the canonical chain to canonicalHead number

This updates the head hashes (if affected) to the hash corresponding to
canonicalHead and cleans up canonical references greater than canonicalHead

#### Parameters

▪ **canonicalHead**: `bigint`

The number to which chain should be reset to

#### Inherited from

Blockchain.resetCanonicalHead

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:165

***

### safeNumberToHash()

> **safeNumberToHash**(`number`): `Promise`\<`false` \| `Uint8Array`\>

This method either returns a Uint8Array if there exists one in the DB or if it
does not exist then return false If DB throws
any other error, this function throws.

#### Parameters

▪ **number**: `bigint`

#### Inherited from

Blockchain.safeNumberToHash

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:361

***

### selectNeededHashes()

> **selectNeededHashes**(`hashes`): `Promise`\<`Uint8Array`[]\>

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

#### Parameters

▪ **hashes**: `Uint8Array`[]

Ordered array of hashes (ordered on `number`).

#### Inherited from

Blockchain.selectNeededHashes

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:244

***

### setIteratorHead()

> **setIteratorHead**(`tag`, `headHash`): `Promise`\<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

▪ **tag**: `string`

The tag to save the headHash to

▪ **headHash**: `Uint8Array`

The head hash to save

#### Inherited from

Blockchain.setIteratorHead

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:295

***

### shallowCopy()

> **shallowCopy**(): `Blockchain`

Returns a deep copy of this [Blockchain]([object Object]) instance.

Note: this does not make a copy of the underlying db
since it is unknown if the source is on disk or in memory.
This should not be a significant issue in most usage since
the queries will only reflect the instance's known data.
If you would like this copied blockchain to use another db
set the [db](/reference/tevm/blockchain/classes/tevmblockchain/#db) of this returned instance to a copy of
the original.

#### Inherited from

Blockchain.shallowCopy

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:75

***

### validateBlock()

> **validateBlock**(`block`): `Promise`\<`void`\>

Validates a block, by validating the header against the current chain, any uncle headers, and then
whether the block is internally consistent

#### Parameters

▪ **block**: [`Block`](/reference/tevm/blockchain/classes/block/)

block to be validated

#### Inherited from

Blockchain.validateBlock

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:201

***

### validateHeader()

> **validateHeader**(`header`, `height`?): `Promise`\<`void`\>

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.
It verifies the current block against the `parentHash`:
- The `parentHash` is part of the blockchain (it is a valid header)
- Current block number is parent block number + 1
- Current block has a strictly higher timestamp
- Additional PoW checks ->
  - Current block has valid difficulty and gas limit
  - In case that the header is an uncle header, it should not be too old or young in the chain.
- Additional PoA clique checks ->
  - Checks on coinbase and mixHash
  - Current block has a timestamp diff greater or equal to PERIOD
  - Current block has difficulty correctly marked as INTURN or NOTURN

#### Parameters

▪ **header**: `BlockHeader`

header to be validated

▪ **height?**: `bigint`

If this is an uncle header, this is the height of the block that is including it

#### Inherited from

Blockchain.validateHeader

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:195

***

### create()

> **`static`** **create**(`opts`?): `Promise`\<`Blockchain`\>

Safe creation of a new Blockchain object awaiting the initialization function,
encouraged method to use when creating a blockchain object.

#### Parameters

▪ **opts?**: `BlockchainOptions`

Constructor options, see [BlockchainOptions]([object Object])

#### Inherited from

Blockchain.create

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:44

***

### fromBlocksData()

> **`static`** **fromBlocksData**(`blocksData`, `opts`?): `Promise`\<`Blockchain`\>

Creates a blockchain from a list of block objects,
objects must be readable by [Block.fromBlockData](/reference/tevm/blockchain/classes/block/#fromblockdata)

#### Parameters

▪ **blocksData**: `BlockData`[]

▪ **opts?**: `BlockchainOptions`

Constructor options, see [BlockchainOptions]([object Object])

#### Inherited from

Blockchain.fromBlocksData

#### Source

node\_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node\_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:52

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
