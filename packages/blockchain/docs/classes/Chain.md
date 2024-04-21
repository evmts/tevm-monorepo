**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Chain

# Class: Chain

Blockchain

## Memberof

module:blockchain

## Implements

- `Pick`\<`Blockchain`, `"consensus"` \| `"db"` \| `"genesisBlock"` \| `"getCanonicalHeadHeader"` \| `"getIteratorHead"` \| `"getIteratorHeadSafe"` \| `"getCanonicalHeadBlock"` \| `"getCanonicalHeadHeader"` \| `"getParentTD"` \| `"getBlock"` \| `"getTotalDifficulty"` \| `"checkAndTransitionHardForkByNumber"` \| `"putBlock"` \| `"putHeader"`\>

## Constructors

### new Chain(options)

> **`protected`** **new Chain**(`options`): [`Chain`](Chain.md)

Creates new chain

Do not use directly but instead use the static async `create()` constructor
for concurrency safe initialization.

#### Parameters

▪ **options**: `ChainOptions`

#### Source

[packages/blockchain/src/Chain.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L201)

## Properties

### \_blocks

> **`private`** **\_blocks**: `ChainBlocks`

#### Source

[packages/blockchain/src/Chain.ts:174](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L174)

***

### \_customGenesisState

> **\_customGenesisState**?: `GenesisState`

#### Source

[packages/blockchain/src/Chain.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L160)

***

### \_customGenesisStateRoot

> **\_customGenesisStateRoot**?: `Uint8Array`

#### Source

[packages/blockchain/src/Chain.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L161)

***

### \_headers

> **`private`** **\_headers**: `ChainHeaders`

#### Source

[packages/blockchain/src/Chain.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L165)

***

### blockCache

> **blockCache**: `BlockCache`

#### Source

[packages/blockchain/src/Chain.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L159)

***

### common

> **common**: `Common`

#### Source

[packages/blockchain/src/Chain.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L147)

***

### consensus

> **consensus**: `Consensus`

#### Implementation of

Pick.consensus

#### Source

[packages/blockchain/src/Chain.ts:158](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L158)

***

### db

> **db**: `DB`\<`string` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

#### Implementation of

Pick.db

#### Source

[packages/blockchain/src/Chain.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L148)

***

### opened

> **opened**: `boolean`

#### Source

[packages/blockchain/src/Chain.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L163)

## Accessors

### blocks

> **`get`** **blocks**(): `ChainBlocks`

Returns properties of the canonical blockchain.

#### Source

[packages/blockchain/src/Chain.ts:308](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L308)

***

### genesis

> **`get`** **genesis**(): `Block`

Network ID
ssj
get networkId(): bigint {
return this.common.networkId()
}

/**
Genesis block for the chain

#### Source

[packages/blockchain/src/Chain.ts:294](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L294)

***

### genesisBlock

> **`get`** **genesisBlock**(): `Block`

#### Source

[packages/blockchain/src/Chain.ts:234](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L234)

***

### headers

> **`get`** **headers**(): `ChainHeaders`

Returns properties of the canonical headerchain.

#### Source

[packages/blockchain/src/Chain.ts:301](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L301)

## Methods

### checkAndTransitionHardForkByNumber()

> **checkAndTransitionHardForkByNumber**(`number`, `td`?, `timestamp`?): `Promise`\<`void`\>

#### Parameters

▪ **number**: `bigint`

▪ **td?**: `bigint`

▪ **timestamp?**: `bigint`

#### Implementation of

Pick.checkAndTransitionHardForkByNumber

#### Source

[packages/blockchain/src/Chain.ts:226](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L226)

***

### close()

> **close**(): `Promise`\<`boolean` \| `void`\>

Closes chain

#### Returns

false if chain is closed, otherwise void

#### Source

[packages/blockchain/src/Chain.ts:327](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L327)

***

### getBlock()

> **getBlock**(`block`): `Promise`\<`Block`\>

Get a block by its hash or number

#### Parameters

▪ **block**: `bigint` \| `Uint8Array`

block hash or number

#### Returns

#### Implementation of

Pick.getBlock

#### Throws

if block is not found

#### Source

[packages/blockchain/src/Chain.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L427)

***

### getBlocks()

> **getBlocks**(`block`, `max`, `skip`, `reverse`): `Promise`\<`Block`[]\>

Get blocks from blockchain

#### Parameters

▪ **block**: `bigint` \| `Uint8Array`

hash or number to start from

▪ **max**: `number`= `1`

maximum number of blocks to get

▪ **skip**: `number`= `0`

number of blocks to skip

▪ **reverse**: `boolean`= `false`

get blocks in reverse

#### Returns

an array of the blocks

#### Source

[packages/blockchain/src/Chain.ts:405](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L405)

***

### getCanonicalFinalizedBlock()

> **getCanonicalFinalizedBlock**(): `Promise`\<`undefined` \| `Block`\>

Gets the latest block in the canonical chain

#### Source

[packages/blockchain/src/Chain.ts:554](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L554)

***

### getCanonicalHeadBlock()

> **getCanonicalHeadBlock**(): `Promise`\<`Block`\>

Gets the latest block in the canonical chain

#### Implementation of

Pick.getCanonicalHeadBlock

#### Source

[packages/blockchain/src/Chain.ts:538](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L538)

***

### getCanonicalHeadHeader()

> **getCanonicalHeadHeader**(): `Promise`\<`BlockHeader`\>

Gets the latest header in the canonical chain

#### Implementation of

Pick.getCanonicalHeadHeader

#### Source

[packages/blockchain/src/Chain.ts:530](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L530)

***

### getCanonicalSafeBlock()

> **getCanonicalSafeBlock**(): `Promise`\<`undefined` \| `Block`\>

Gets the latest block in the canonical chain

#### Source

[packages/blockchain/src/Chain.ts:546](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L546)

***

### getCanonicalVmHead()

> **getCanonicalVmHead**(): `Promise`\<`Block`\>

Gets the latest block in the canonical chain

#### Source

[packages/blockchain/src/Chain.ts:562](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L562)

***

### getHeaders()

> **getHeaders**(`block`, `max`, `skip`, `reverse`): `Promise`\<`BlockHeader`[]\>

Get headers from blockchain

#### Parameters

▪ **block**: `bigint` \| `Uint8Array`

hash or number to start from

▪ **max**: `number`

maximum number of headers to get

▪ **skip**: `number`

number of headers to skip

▪ **reverse**: `boolean`

get headers in reverse

#### Returns

list of block headers

#### Source

[packages/blockchain/src/Chain.ts:492](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L492)

***

### getIteratorHead()

> **getIteratorHead**(`name`?): `Promise`\<`Block`\>

#### Parameters

▪ **name?**: `string`

#### Implementation of

Pick.getIteratorHead

#### Source

[packages/blockchain/src/Chain.ts:237](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L237)

***

### getIteratorHeadSafe()

> **getIteratorHeadSafe**(`name`?): `Promise`\<`undefined` \| `Block`\>

#### Parameters

▪ **name?**: `string`

#### Implementation of

Pick.getIteratorHeadSafe

#### Source

[packages/blockchain/src/Chain.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L241)

***

### getParentTD()

> **getParentTD**(`header`): `Promise`\<`bigint`\>

#### Parameters

▪ **header**: `BlockHeader`

#### Implementation of

Pick.getParentTD

#### Source

[packages/blockchain/src/Chain.ts:245](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L245)

***

### getTd()

> **getTd**(`hash`, `num`): `Promise`\<`bigint`\>

Gets total difficulty for a block

#### Parameters

▪ **hash**: `Uint8Array`

the block hash

▪ **num**: `bigint`

the block number

#### Returns

the td

#### Source

[packages/blockchain/src/Chain.ts:573](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L573)

***

### getTotalDifficulty()

> **getTotalDifficulty**(`hash`, `number`?): `Promise`\<`bigint`\>

#### Parameters

▪ **hash**: `Uint8Array`

▪ **number?**: `bigint`

#### Implementation of

Pick.getTotalDifficulty

#### Source

[packages/blockchain/src/Chain.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L249)

***

### hasBlock()

> **hasBlock**(`block`): `Promise`\<`boolean`\>

Get a block by its hash or number

#### Parameters

▪ **block**: `bigint` \| `Uint8Array`

block hash or number

#### Returns

#### Throws

if block is not found

#### Source

[packages/blockchain/src/Chain.ts:415](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L415)

***

### open()

> **open**(): `Promise`\<`boolean` \| `void`\>

Open blockchain and wait for database to load

#### Returns

false if chain is already open, otherwise void

#### Source

[packages/blockchain/src/Chain.ts:316](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L316)

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

#### Parameters

▪ **block**: `Block`

#### Implementation of

Pick.putBlock

#### Source

[packages/blockchain/src/Chain.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L253)

***

### putBlocks()

> **putBlocks**(`blocks`, `fromEngine`): `Promise`\<`void`\>

Insert new blocks into blockchain

#### Parameters

▪ **blocks**: `Block`[]

list of blocks to add

▪ **fromEngine**: `boolean`= `false`

pass true to process post-merge blocks, otherwise they will be skipped

#### Source

[packages/blockchain/src/Chain.ts:437](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L437)

***

### putHeader()

> **putHeader**(`header`): `Promise`\<`void`\>

#### Parameters

▪ **header**: `BlockHeader`

#### Implementation of

Pick.putHeader

#### Source

[packages/blockchain/src/Chain.ts:257](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L257)

***

### putHeaders()

> **putHeaders**(`headers`, `mergeIncludes`): `Promise`\<`void`\>

Insert new headers into blockchain

#### Parameters

▪ **headers**: `BlockHeader`[]

▪ **mergeIncludes**: `boolean`= `false`

skip adding headers after merge

#### Returns

number of headers added

#### Source

[packages/blockchain/src/Chain.ts:503](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L503)

***

### reset()

> **`private`** **reset**(): `void`

Resets _header, _blocks

#### Source

[packages/blockchain/src/Chain.ts:265](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L265)

***

### resetCanonicalHead()

> **resetCanonicalHead**(`canonicalHead`): `Promise`\<`void`\>

Resets the chain to canonicalHead number

#### Parameters

▪ **canonicalHead**: `bigint`

#### Source

[packages/blockchain/src/Chain.ts:337](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L337)

***

### shallowCopy()

> **`readonly`** **shallowCopy**(): [`Chain`](Chain.md)

#### Source

[packages/blockchain/src/Chain.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L139)

***

### update()

> **update**(): `Promise`\<`boolean` \| `void`\>

Update blockchain properties (latest block, td, height, etc...)

#### Returns

false if chain is closed, otherwise void

#### Source

[packages/blockchain/src/Chain.ts:348](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L348)

***

### validateHeader()

> **validateHeader**(): `Promise`\<`void`\>

Validates a block header, throwing if invalid.

#### Returns

#### Warning

currently stubbed to noop

#### Source

[packages/blockchain/src/Chain.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L155)

***

### create()

> **`static`** **create**(`options`): `Promise`\<[`Chain`](Chain.md)\>

Safe creation of a Chain object awaiting the initialization
of the underlying Blockchain object.

#### Parameters

▪ **options**: `ChainOptions`

#### Source

[packages/blockchain/src/Chain.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L189)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
