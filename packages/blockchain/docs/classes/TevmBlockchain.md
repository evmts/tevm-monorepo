[@tevm/blockchain](../README.md) / [Exports](../modules.md) / TevmBlockchain

# Class: TevmBlockchain

A custom tevm wrapper around the EthereumJS Blockchain class.
This class stores and interacts with blocks.

## Hierarchy

- `Blockchain`

  ↳ **`TevmBlockchain`**

## Table of contents

### Constructors

- [constructor](TevmBlockchain.md#constructor)

### Properties

- [\_isInitialized](TevmBlockchain.md#_isinitialized)
- [common](TevmBlockchain.md#common)
- [consensus](TevmBlockchain.md#consensus)
- [db](TevmBlockchain.md#db)
- [dbManager](TevmBlockchain.md#dbmanager)

### Accessors

- [genesisBlock](TevmBlockchain.md#genesisblock)

### Methods

- [checkAndTransitionHardForkByNumber](TevmBlockchain.md#checkandtransitionhardforkbynumber)
- [createGenesisBlock](TevmBlockchain.md#creategenesisblock)
- [delBlock](TevmBlockchain.md#delblock)
- [getBlock](TevmBlockchain.md#getblock)
- [getBlocks](TevmBlockchain.md#getblocks)
- [getCanonicalHeadBlock](TevmBlockchain.md#getcanonicalheadblock)
- [getCanonicalHeadHeader](TevmBlockchain.md#getcanonicalheadheader)
- [getCanonicalHeader](TevmBlockchain.md#getcanonicalheader)
- [getIteratorHead](TevmBlockchain.md#getiteratorhead)
- [getIteratorHeadSafe](TevmBlockchain.md#getiteratorheadsafe)
- [getParentTD](TevmBlockchain.md#getparenttd)
- [getTotalDifficulty](TevmBlockchain.md#gettotaldifficulty)
- [iterator](TevmBlockchain.md#iterator)
- [putBlock](TevmBlockchain.md#putblock)
- [putBlocks](TevmBlockchain.md#putblocks)
- [putHeader](TevmBlockchain.md#putheader)
- [putHeaders](TevmBlockchain.md#putheaders)
- [resetCanonicalHead](TevmBlockchain.md#resetcanonicalhead)
- [safeNumberToHash](TevmBlockchain.md#safenumbertohash)
- [selectNeededHashes](TevmBlockchain.md#selectneededhashes)
- [setIteratorHead](TevmBlockchain.md#setiteratorhead)
- [shallowCopy](TevmBlockchain.md#shallowcopy)
- [validateBlock](TevmBlockchain.md#validateblock)
- [validateHeader](TevmBlockchain.md#validateheader)
- [create](TevmBlockchain.md#create)
- [fromBlocksData](TevmBlockchain.md#fromblocksdata)

## Constructors

### constructor

• **new TevmBlockchain**(`opts?`): [`TevmBlockchain`](TevmBlockchain.md)

Creates new Blockchain object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | `BlockchainOptions` | An object with the options that this constructor takes. See BlockchainOptions. |

#### Returns

[`TevmBlockchain`](TevmBlockchain.md)

**`Deprecated`**

The direct usage of this constructor is discouraged since
non-finalized async initialization might lead to side effects. Please
use the async [Blockchain.create](TevmBlockchain.md#create) constructor instead (same API).

#### Inherited from

Blockchain.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:63

## Properties

### \_isInitialized

• `Protected` **\_isInitialized**: `boolean`

#### Inherited from

Blockchain.\_isInitialized

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:32

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

Blockchain.common

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:34

___

### consensus

• **consensus**: `Consensus`

#### Inherited from

Blockchain.consensus

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:11

___

### db

• **db**: `DB`\<`string` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

#### Inherited from

Blockchain.db

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:12

___

### dbManager

• **dbManager**: `DBManager`

#### Inherited from

Blockchain.dbManager

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:13

## Accessors

### genesisBlock

• `get` **genesisBlock**(): [`Block`](Block.md)

The genesis [Block](Block.md) for the blockchain.

#### Returns

[`Block`](Block.md)

#### Inherited from

Blockchain.genesisBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:365

## Methods

### checkAndTransitionHardForkByNumber

▸ **checkAndTransitionHardForkByNumber**(`number`, `td?`, `timestamp?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `BigIntLike` |
| `td?` | `BigIntLike` |
| `timestamp?` | `BigIntLike` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.checkAndTransitionHardForkByNumber

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:350

___

### createGenesisBlock

▸ **createGenesisBlock**(`stateRoot`): [`Block`](Block.md)

Creates a genesis [Block](Block.md) for the blockchain with params from Common.genesis

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | `Uint8Array` | The genesis stateRoot |

#### Returns

[`Block`](Block.md)

#### Inherited from

Blockchain.createGenesisBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:370

___

### delBlock

▸ **delBlock**(`blockHash`): `Promise`\<`void`\>

Completely deletes a block from the blockchain including any references to
this block. If this block was in the canonical chain, then also each child
block of this block is deleted Also, if this was a canonical block, each
head header which is part of this now stale chain will be set to the
parentHeader of this block An example reason to execute is when running the
block in the VM invalidates this block: this will then reset the canonical
head to the past block (which has been validated in the past by the VM, so
we can be sure it is correct).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | `Uint8Array` | The hash of the block to be deleted |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.delBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:256

___

### getBlock

▸ **getBlock**(`blockId`): `Promise`\<[`Block`](Block.md)\>

Gets a block by its hash or number.  If a number is provided, the returned
block will be the canonical block at that number in the chain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Uint8Array` | The block's hash or number. If a hash is provided, then this will be immediately looked up, otherwise it will wait until we have unlocked the DB |

#### Returns

`Promise`\<[`Block`](Block.md)\>

#### Inherited from

Blockchain.getBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:219

___

### getBlocks

▸ **getBlocks**(`blockId`, `maxBlocks`, `skip`, `reverse`): `Promise`\<[`Block`](Block.md)[]\>

Looks up many blocks relative to blockId Note: due to `GetBlockHeaders
(0x03)` (ETH wire protocol) we have to support skip/reverse as well.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockId` | `number` \| `bigint` \| `Uint8Array` | The block's hash or number |
| `maxBlocks` | `number` | Max number of blocks to return |
| `skip` | `number` | Number of blocks to skip apart |
| `reverse` | `boolean` | Fetch blocks in reverse |

#### Returns

`Promise`\<[`Block`](Block.md)[]\>

#### Inherited from

Blockchain.getBlocks

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:237

___

### getCanonicalHeadBlock

▸ **getCanonicalHeadBlock**(): `Promise`\<[`Block`](Block.md)\>

Returns the latest full block in the canonical chain.

#### Returns

`Promise`\<[`Block`](Block.md)\>

#### Inherited from

Blockchain.getCanonicalHeadBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:119

___

### getCanonicalHeadHeader

▸ **getCanonicalHeadHeader**(): `Promise`\<`BlockHeader`\>

Returns the latest header in the canonical chain.

#### Returns

`Promise`\<`BlockHeader`\>

#### Inherited from

Blockchain.getCanonicalHeadHeader

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:115

___

### getCanonicalHeader

▸ **getCanonicalHeader**(`number`): `Promise`\<`BlockHeader`\>

Gets a header by number. Header must be in the canonical chain

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |

#### Returns

`Promise`\<`BlockHeader`\>

#### Inherited from

Blockchain.getCanonicalHeader

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:354

___

### getIteratorHead

▸ **getIteratorHead**(`name?`): `Promise`\<[`Block`](Block.md)\>

Returns the specified iterator head.

This function replaces the old Blockchain.getHead() method. Note that
the function deviates from the old behavior and returns the
genesis hash instead of the current head block if an iterator
has not been run. This matches the behavior of [Blockchain.iterator](TevmBlockchain.md#iterator).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`\<[`Block`](Block.md)\>

#### Inherited from

Blockchain.getIteratorHead

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:104

___

### getIteratorHeadSafe

▸ **getIteratorHeadSafe**(`name?`): `Promise`\<`undefined` \| [`Block`](Block.md)\>

This method differs from `getIteratorHead`. If the head is not found, it returns `undefined`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name?` | `string` | Optional name of the iterator head (default: 'vm') |

#### Returns

`Promise`\<`undefined` \| [`Block`](Block.md)\>

#### Inherited from

Blockchain.getIteratorHeadSafe

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:110

___

### getParentTD

▸ **getParentTD**(`header`): `Promise`\<`bigint`\>

Gets total difficulty for a header's parent, helpful for determining terminal block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | Block header whose parent td is desired |

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

Blockchain.getParentTD

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:228

___

### getTotalDifficulty

▸ **getTotalDifficulty**(`hash`, `number?`): `Promise`\<`bigint`\>

Gets total difficulty for a block specified by hash and number

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `Uint8Array` |
| `number?` | `bigint` |

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

Blockchain.getTotalDifficulty

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:223

___

### iterator

▸ **iterator**(`name`, `onBlock`, `maxBlocks?`, `releaseLockOnCallback?`): `Promise`\<`number`\>

Iterates through blocks starting at the specified iterator head and calls
the onBlock function on each block. The current location of an iterator
head can be retrieved using [Blockchain.getIteratorHead](TevmBlockchain.md#getiteratorhead).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the state root head |
| `onBlock` | `OnBlock` | Function called on each block with params (block, reorg) |
| `maxBlocks?` | `number` | How many blocks to run. By default, run all unprocessed blocks in the canonical chain. |
| `releaseLockOnCallback?` | `boolean` | Do not lock the blockchain for running the callback (default: `false`) |

#### Returns

`Promise`\<`number`\>

number of blocks actually iterated

#### Inherited from

Blockchain.iterator

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:288

___

### putBlock

▸ **putBlock**(`block`): `Promise`\<`void`\>

Adds a block to the blockchain.

If the block is valid and has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | [`Block`](Block.md) | The block to be added to the blockchain |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.putBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:138

___

### putBlocks

▸ **putBlocks**(`blocks`): `Promise`\<`void`\>

Adds blocks to the blockchain.

If an invalid block is met the function will throw, blocks before will
nevertheless remain in the DB. If any of the saved blocks has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocks` | [`Block`](Block.md)[] | The blocks to be added to the blockchain |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.putBlocks

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:129

___

### putHeader

▸ **putHeader**(`header`): `Promise`\<`void`\>

Adds a header to the blockchain.

If this header is valid and it has a higher total difficulty than the current
max total difficulty, the canonical chain is rebuilt and any stale
heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | The header to be added to the blockchain |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.putHeader

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:157

___

### putHeaders

▸ **putHeaders**(`headers`): `Promise`\<`void`\>

Adds many headers to the blockchain.

If an invalid header is met the function will throw, headers before will
nevertheless remain in the DB. If any of the saved headers has a higher
total difficulty than the current max total difficulty the canonical
chain is rebuilt and any stale heads/hashes are overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headers` | `any`[] | The headers to be added to the blockchain |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.putHeaders

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:148

___

### resetCanonicalHead

▸ **resetCanonicalHead**(`canonicalHead`): `Promise`\<`void`\>

Resets the canonical chain to canonicalHead number

This updates the head hashes (if affected) to the hash corresponding to
canonicalHead and cleans up canonical references greater than canonicalHead

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canonicalHead` | `bigint` | The number to which chain should be reset to |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.resetCanonicalHead

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:165

___

### safeNumberToHash

▸ **safeNumberToHash**(`number`): `Promise`\<``false`` \| `Uint8Array`\>

This method either returns a Uint8Array if there exists one in the DB or if it
does not exist then return false If DB throws
any other error, this function throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `bigint` |

#### Returns

`Promise`\<``false`` \| `Uint8Array`\>

#### Inherited from

Blockchain.safeNumberToHash

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:361

___

### selectNeededHashes

▸ **selectNeededHashes**(`hashes`): `Promise`\<`Uint8Array`[]\>

Given an ordered array, returns an array of hashes that are not in the
blockchain yet. Uses binary search to find out what hashes are missing.
Therefore, the array needs to be ordered upon number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hashes` | `Uint8Array`[] | Ordered array of hashes (ordered on `number`). |

#### Returns

`Promise`\<`Uint8Array`[]\>

#### Inherited from

Blockchain.selectNeededHashes

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:244

___

### setIteratorHead

▸ **setIteratorHead**(`tag`, `headHash`): `Promise`\<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tag` | `string` | The tag to save the headHash to |
| `headHash` | `Uint8Array` | The head hash to save |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.setIteratorHead

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:295

___

### shallowCopy

▸ **shallowCopy**(): `Blockchain`

Returns a deep copy of this Blockchain instance.

Note: this does not make a copy of the underlying db
since it is unknown if the source is on disk or in memory.
This should not be a significant issue in most usage since
the queries will only reflect the instance's known data.
If you would like this copied blockchain to use another db
set the [db](TevmBlockchain.md#db) of this returned instance to a copy of
the original.

#### Returns

`Blockchain`

#### Inherited from

Blockchain.shallowCopy

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:75

___

### validateBlock

▸ **validateBlock**(`block`): `Promise`\<`void`\>

Validates a block, by validating the header against the current chain, any uncle headers, and then
whether the block is internally consistent

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | [`Block`](Block.md) | block to be validated |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.validateBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:201

___

### validateHeader

▸ **validateHeader**(`header`, `height?`): `Promise`\<`void`\>

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `BlockHeader` | header to be validated |
| `height?` | `bigint` | If this is an uncle header, this is the height of the block that is including it |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Blockchain.validateHeader

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:195

___

### create

▸ **create**(`opts?`): `Promise`\<`Blockchain`\>

Safe creation of a new Blockchain object awaiting the initialization function,
encouraged method to use when creating a blockchain object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts?` | `BlockchainOptions` | Constructor options, see BlockchainOptions |

#### Returns

`Promise`\<`Blockchain`\>

#### Inherited from

Blockchain.create

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:44

___

### fromBlocksData

▸ **fromBlocksData**(`blocksData`, `opts?`): `Promise`\<`Blockchain`\>

Creates a blockchain from a list of block objects,
objects must be readable by [Block.fromBlockData](Block.md#fromblockdata)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blocksData` | `BlockData`[] | - |
| `opts?` | `BlockchainOptions` | Constructor options, see BlockchainOptions |

#### Returns

`Promise`\<`Blockchain`\>

#### Inherited from

Blockchain.fromBlocksData

#### Defined in

node_modules/.pnpm/@ethereumjs+blockchain@7.0.1/node_modules/@ethereumjs/blockchain/dist/esm/blockchain.d.ts:52
