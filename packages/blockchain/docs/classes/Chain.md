**@tevm/blockchain** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/blockchain](../README.md) / Chain

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

• **options**: `ChainOptions`

#### Returns

[`Chain`](Chain.md)

#### Source

[packages/blockchain/src/Chain.ts:214](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L214)

## Properties

### \_blocks

> **`private`** **\_blocks**: `ChainBlocks`

#### Source

[packages/blockchain/src/Chain.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L187)

***

### \_customGenesisState?

> **`optional`** **\_customGenesisState**: `GenesisState`

#### Source

[packages/blockchain/src/Chain.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L173)

***

### \_customGenesisStateRoot?

> **`optional`** **\_customGenesisStateRoot**: `Uint8Array`

#### Source

[packages/blockchain/src/Chain.ts:174](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L174)

***

### \_headers

> **`private`** **\_headers**: `ChainHeaders`

#### Source

[packages/blockchain/src/Chain.ts:178](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L178)

***

### blockCache

> **blockCache**: `BlockCache`

#### Source

[packages/blockchain/src/Chain.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L172)

***

### common

> **common**: `Common`

#### Source

[packages/blockchain/src/Chain.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L160)

***

### consensus

> **consensus**: `Consensus`

#### Implementation of

`Pick.consensus`

#### Source

[packages/blockchain/src/Chain.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L171)

***

### db

> **db**: `DB`\<`string` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

#### Implementation of

`Pick.db`

#### Source

[packages/blockchain/src/Chain.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L161)

***

### opened

> **opened**: `boolean`

#### Source

[packages/blockchain/src/Chain.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L176)

## Accessors

### blocks

> **`get`** **blocks**(): `ChainBlocks`

Returns properties of the canonical blockchain.

#### Returns

`ChainBlocks`

#### Source

[packages/blockchain/src/Chain.ts:326](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L326)

***

### genesis

> **`get`** **genesis**(): `Block`

Network ID
ssj
get networkId(): bigint \{
return this.common.networkId()
\}

/**
Genesis block for the chain

#### Returns

`Block`

#### Source

[packages/blockchain/src/Chain.ts:312](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L312)

***

### genesisBlock

> **`get`** **genesisBlock**(): `Block`

#### Returns

`Block`

#### Source

[packages/blockchain/src/Chain.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L249)

***

### headers

> **`get`** **headers**(): `ChainHeaders`

Returns properties of the canonical headerchain.

#### Returns

`ChainHeaders`

#### Source

[packages/blockchain/src/Chain.ts:319](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L319)

## Methods

### checkAndTransitionHardForkByNumber()

> **checkAndTransitionHardForkByNumber**(`number`, `td`?, `timestamp`?): `Promise`\<`void`\>

#### Parameters

• **number**: `bigint`

• **td?**: `bigint`

• **timestamp?**: `bigint`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Pick.checkAndTransitionHardForkByNumber`

#### Source

[packages/blockchain/src/Chain.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L241)

***

### close()

> **close**(): `Promise`\<`boolean` \| `void`\>

Closes chain

#### Returns

`Promise`\<`boolean` \| `void`\>

false if chain is closed, otherwise void

#### Source

[packages/blockchain/src/Chain.ts:345](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L345)

***

### getBlock()

> **getBlock**(`block`): `Promise`\<`Block`\>

Get a block by its hash or number

#### Parameters

• **block**: `bigint` \| `Uint8Array`

block hash or number

#### Returns

`Promise`\<`Block`\>

#### Implementation of

`Pick.getBlock`

#### Throws

if block is not found

#### Source

[packages/blockchain/src/Chain.ts:450](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L450)

***

### getBlocks()

> **getBlocks**(`block`, `max`, `skip`, `reverse`): `Promise`\<`Block`[]\>

Get blocks from blockchain

#### Parameters

• **block**: `bigint` \| `Uint8Array`

hash or number to start from

• **max**: `number`= `1`

maximum number of blocks to get

• **skip**: `number`= `0`

number of blocks to skip

• **reverse**: `boolean`= `false`

get blocks in reverse

#### Returns

`Promise`\<`Block`[]\>

an array of the blocks

#### Source

[packages/blockchain/src/Chain.ts:423](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L423)

***

### getCanonicalFinalizedBlock()

> **getCanonicalFinalizedBlock**(): `Promise`\<`undefined` \| `Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`undefined` \| `Block`\>

#### Source

[packages/blockchain/src/Chain.ts:592](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L592)

***

### getCanonicalHeadBlock()

> **getCanonicalHeadBlock**(): `Promise`\<`Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`Block`\>

#### Implementation of

`Pick.getCanonicalHeadBlock`

#### Source

[packages/blockchain/src/Chain.ts:576](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L576)

***

### getCanonicalHeadHeader()

> **getCanonicalHeadHeader**(): `Promise`\<`BlockHeader`\>

Gets the latest header in the canonical chain

#### Returns

`Promise`\<`BlockHeader`\>

#### Implementation of

`Pick.getCanonicalHeadHeader`

#### Source

[packages/blockchain/src/Chain.ts:568](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L568)

***

### getCanonicalSafeBlock()

> **getCanonicalSafeBlock**(): `Promise`\<`undefined` \| `Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`undefined` \| `Block`\>

#### Source

[packages/blockchain/src/Chain.ts:584](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L584)

***

### getCanonicalVmHead()

> **getCanonicalVmHead**(): `Promise`\<`Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`Block`\>

#### Source

[packages/blockchain/src/Chain.ts:600](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L600)

***

### getHeaders()

> **getHeaders**(`block`, `max`, `skip`, `reverse`): `Promise`\<`BlockHeader`[]\>

Get headers from blockchain

#### Parameters

• **block**: `bigint` \| `Uint8Array`

hash or number to start from

• **max**: `number`

maximum number of headers to get

• **skip**: `number`

number of headers to skip

• **reverse**: `boolean`

get headers in reverse

#### Returns

`Promise`\<`BlockHeader`[]\>

list of block headers

#### Source

[packages/blockchain/src/Chain.ts:522](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L522)

***

### getIteratorHead()

> **getIteratorHead**(`name`?): `Promise`\<`Block`\>

#### Parameters

• **name?**: `string`

#### Returns

`Promise`\<`Block`\>

#### Implementation of

`Pick.getIteratorHead`

#### Source

[packages/blockchain/src/Chain.ts:252](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L252)

***

### getIteratorHeadSafe()

> **getIteratorHeadSafe**(`name`?): `Promise`\<`undefined` \| `Block`\>

#### Parameters

• **name?**: `string`

#### Returns

`Promise`\<`undefined` \| `Block`\>

#### Implementation of

`Pick.getIteratorHeadSafe`

#### Source

[packages/blockchain/src/Chain.ts:256](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L256)

***

### getParentTD()

> **getParentTD**(`header`): `Promise`\<`bigint`\>

#### Parameters

• **header**: `BlockHeader`

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

`Pick.getParentTD`

#### Source

[packages/blockchain/src/Chain.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L260)

***

### getTd()

> **getTd**(`hash`, `num`): `Promise`\<`bigint`\>

Gets total difficulty for a block

#### Parameters

• **hash**: `Uint8Array`

the block hash

• **num**: `bigint`

the block number

#### Returns

`Promise`\<`bigint`\>

the td

#### Source

[packages/blockchain/src/Chain.ts:611](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L611)

***

### getTotalDifficulty()

> **getTotalDifficulty**(`hash`, `number`?): `Promise`\<`bigint`\>

#### Parameters

• **hash**: `Uint8Array`

• **number?**: `bigint`

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

`Pick.getTotalDifficulty`

#### Source

[packages/blockchain/src/Chain.ts:264](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L264)

***

### hasBlock()

> **hasBlock**(`block`): `Promise`\<`boolean`\>

Get a block by its hash or number

#### Parameters

• **block**: `bigint` \| `Uint8Array`

block hash or number

#### Returns

`Promise`\<`boolean`\>

#### Throws

if block is not found

#### Source

[packages/blockchain/src/Chain.ts:438](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L438)

***

### open()

> **open**(): `Promise`\<`boolean` \| `void`\>

Open blockchain and wait for database to load

#### Returns

`Promise`\<`boolean` \| `void`\>

false if chain is already open, otherwise void

#### Source

[packages/blockchain/src/Chain.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L334)

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

#### Parameters

• **block**: `Block`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Pick.putBlock`

#### Source

[packages/blockchain/src/Chain.ts:271](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L271)

***

### putBlocks()

> **putBlocks**(`blocks`, `fromEngine`): `Promise`\<`void`\>

Insert new blocks into blockchain

#### Parameters

• **blocks**: `Block`[]

list of blocks to add

• **fromEngine**: `boolean`= `false`

pass true to process post-merge blocks, otherwise they will be skipped

#### Returns

`Promise`\<`void`\>

#### Source

[packages/blockchain/src/Chain.ts:460](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L460)

***

### putHeader()

> **putHeader**(`header`): `Promise`\<`void`\>

#### Parameters

• **header**: `BlockHeader`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Pick.putHeader`

#### Source

[packages/blockchain/src/Chain.ts:275](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L275)

***

### putHeaders()

> **putHeaders**(`headers`, `mergeIncludes`): `Promise`\<`void`\>

Insert new headers into blockchain

#### Parameters

• **headers**: `BlockHeader`[]

• **mergeIncludes**: `boolean`= `false`

skip adding headers after merge

#### Returns

`Promise`\<`void`\>

number of headers added

#### Source

[packages/blockchain/src/Chain.ts:538](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L538)

***

### reset()

> **`private`** **reset**(): `void`

Resets _header, _blocks

#### Returns

`void`

#### Source

[packages/blockchain/src/Chain.ts:283](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L283)

***

### resetCanonicalHead()

> **resetCanonicalHead**(`canonicalHead`): `Promise`\<`void`\>

Resets the chain to canonicalHead number

#### Parameters

• **canonicalHead**: `bigint`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/blockchain/src/Chain.ts:355](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L355)

***

### shallowCopy()

> **`readonly`** **shallowCopy**(): [`Chain`](Chain.md)

#### Returns

[`Chain`](Chain.md)

#### Source

[packages/blockchain/src/Chain.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L148)

***

### update()

> **update**(): `Promise`\<`boolean` \| `void`\>

Update blockchain properties (latest block, td, height, etc...)

#### Returns

`Promise`\<`boolean` \| `void`\>

false if chain is closed, otherwise void

#### Source

[packages/blockchain/src/Chain.ts:366](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L366)

***

### validateHeader()

> **validateHeader**(): `Promise`\<`void`\>

Validates a block header, throwing if invalid.

#### Returns

`Promise`\<`void`\>

#### Warning

currently stubbed to noop

#### Source

[packages/blockchain/src/Chain.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L168)

***

### create()

> **`static`** **create**(`options`): `Promise`\<[`Chain`](Chain.md)\>

Safe creation of a Chain object awaiting the initialization
of the underlying Blockchain object.

#### Parameters

• **options**: `ChainOptions`

#### Returns

`Promise`\<[`Chain`](Chain.md)\>

#### Source

[packages/blockchain/src/Chain.ts:202](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L202)
