[@tevm/blockchain](../README.md) / [Exports](../modules.md) / Chain

# Class: Chain

Blockchain

**`Memberof`**

module:blockchain

## Table of contents

### Constructors

- [constructor](Chain.md#constructor)

### Properties

- [\_blocks](Chain.md#_blocks)
- [\_customGenesisState](Chain.md#_customgenesisstate)
- [\_customGenesisStateRoot](Chain.md#_customgenesisstateroot)
- [\_headers](Chain.md#_headers)
- [blockCache](Chain.md#blockcache)
- [blockchain](Chain.md#blockchain)
- [chainDB](Chain.md#chaindb)
- [common](Chain.md#common)
- [opened](Chain.md#opened)

### Accessors

- [blocks](Chain.md#blocks)
- [genesis](Chain.md#genesis)
- [headers](Chain.md#headers)
- [networkId](Chain.md#networkid)

### Methods

- [close](Chain.md#close)
- [getBlock](Chain.md#getblock)
- [getBlocks](Chain.md#getblocks)
- [getCanonicalFinalizedBlock](Chain.md#getcanonicalfinalizedblock)
- [getCanonicalHeadBlock](Chain.md#getcanonicalheadblock)
- [getCanonicalHeadHeader](Chain.md#getcanonicalheadheader)
- [getCanonicalSafeBlock](Chain.md#getcanonicalsafeblock)
- [getCanonicalVmHead](Chain.md#getcanonicalvmhead)
- [getHeaders](Chain.md#getheaders)
- [getTd](Chain.md#gettd)
- [hasBlock](Chain.md#hasblock)
- [open](Chain.md#open)
- [putBlocks](Chain.md#putblocks)
- [putHeaders](Chain.md#putheaders)
- [reset](Chain.md#reset)
- [resetCanonicalHead](Chain.md#resetcanonicalhead)
- [update](Chain.md#update)
- [create](Chain.md#create)

## Constructors

### constructor

• **new Chain**(`options`): [`Chain`](Chain.md)

Creates new chain

Do not use directly but instead use the static async `create()` constructor
for concurrency safe initialization.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ChainOptions` |

#### Returns

[`Chain`](Chain.md)

#### Defined in

[packages/blockchain/src/Chain.ts:191](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L191)

## Properties

### \_blocks

• `Private` **\_blocks**: `ChainBlocks`

#### Defined in

[packages/blockchain/src/Chain.ts:146](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L146)

___

### \_customGenesisState

• `Optional` **\_customGenesisState**: `GenesisState`

#### Defined in

[packages/blockchain/src/Chain.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L132)

___

### \_customGenesisStateRoot

• `Optional` **\_customGenesisStateRoot**: `Uint8Array`

#### Defined in

[packages/blockchain/src/Chain.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L133)

___

### \_headers

• `Private` **\_headers**: `ChainHeaders`

#### Defined in

[packages/blockchain/src/Chain.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L137)

___

### blockCache

• **blockCache**: `BlockCache`

#### Defined in

[packages/blockchain/src/Chain.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L131)

___

### blockchain

• **blockchain**: `Blockchain`

#### Defined in

[packages/blockchain/src/Chain.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L129)

___

### chainDB

• **chainDB**: `DB`\<`string` \| `Uint8Array`, `string` \| `Uint8Array` \| `DBObject`\>

#### Defined in

[packages/blockchain/src/Chain.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L128)

___

### common

• **common**: `Common`

#### Defined in

[packages/blockchain/src/Chain.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L130)

___

### opened

• **opened**: `boolean`

#### Defined in

[packages/blockchain/src/Chain.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L135)

## Accessors

### blocks

• `get` **blocks**(): `ChainBlocks`

Returns properties of the canonical blockchain.

#### Returns

`ChainBlocks`

#### Defined in

[packages/blockchain/src/Chain.ts:252](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L252)

___

### genesis

• `get` **genesis**(): `Block`

Genesis block for the chain

#### Returns

`Block`

#### Defined in

[packages/blockchain/src/Chain.ts:238](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L238)

___

### headers

• `get` **headers**(): `ChainHeaders`

Returns properties of the canonical headerchain.

#### Returns

`ChainHeaders`

#### Defined in

[packages/blockchain/src/Chain.ts:245](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L245)

___

### networkId

• `get` **networkId**(): `bigint`

Network ID

#### Returns

`bigint`

#### Defined in

[packages/blockchain/src/Chain.ts:231](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L231)

## Methods

### close

▸ **close**(): `Promise`\<`boolean` \| `void`\>

Closes chain

#### Returns

`Promise`\<`boolean` \| `void`\>

false if chain is closed, otherwise void

#### Defined in

[packages/blockchain/src/Chain.ts:271](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L271)

___

### getBlock

▸ **getBlock**(`block`): `Promise`\<`Block`\>

Get a block by its hash or number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `bigint` \| `Uint8Array` | block hash or number |

#### Returns

`Promise`\<`Block`\>

**`Throws`**

if block is not found

#### Defined in

[packages/blockchain/src/Chain.ts:377](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L377)

___

### getBlocks

▸ **getBlocks**(`block`, `max?`, `skip?`, `reverse?`): `Promise`\<`Block`[]\>

Get blocks from blockchain

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `block` | `bigint` \| `Uint8Array` | `undefined` | hash or number to start from |
| `max` | `number` | `1` | maximum number of blocks to get |
| `skip` | `number` | `0` | number of blocks to skip |
| `reverse` | `boolean` | `false` | get blocks in reverse |

#### Returns

`Promise`\<`Block`[]\>

an array of the blocks

#### Defined in

[packages/blockchain/src/Chain.ts:349](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L349)

___

### getCanonicalFinalizedBlock

▸ **getCanonicalFinalizedBlock**(): `Promise`\<`undefined` \| `Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`undefined` \| `Block`\>

#### Defined in

[packages/blockchain/src/Chain.ts:520](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L520)

___

### getCanonicalHeadBlock

▸ **getCanonicalHeadBlock**(): `Promise`\<`Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`Block`\>

#### Defined in

[packages/blockchain/src/Chain.ts:504](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L504)

___

### getCanonicalHeadHeader

▸ **getCanonicalHeadHeader**(): `Promise`\<`BlockHeader`\>

Gets the latest header in the canonical chain

#### Returns

`Promise`\<`BlockHeader`\>

#### Defined in

[packages/blockchain/src/Chain.ts:496](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L496)

___

### getCanonicalSafeBlock

▸ **getCanonicalSafeBlock**(): `Promise`\<`undefined` \| `Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`undefined` \| `Block`\>

#### Defined in

[packages/blockchain/src/Chain.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L512)

___

### getCanonicalVmHead

▸ **getCanonicalVmHead**(): `Promise`\<`Block`\>

Gets the latest block in the canonical chain

#### Returns

`Promise`\<`Block`\>

#### Defined in

[packages/blockchain/src/Chain.ts:528](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L528)

___

### getHeaders

▸ **getHeaders**(`block`, `max`, `skip`, `reverse`): `Promise`\<`BlockHeader`[]\>

Get headers from blockchain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `bigint` \| `Uint8Array` | hash or number to start from |
| `max` | `number` | maximum number of headers to get |
| `skip` | `number` | number of headers to skip |
| `reverse` | `boolean` | get headers in reverse |

#### Returns

`Promise`\<`BlockHeader`[]\>

list of block headers

#### Defined in

[packages/blockchain/src/Chain.ts:450](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L450)

___

### getTd

▸ **getTd**(`hash`, `num`): `Promise`\<`bigint`\>

Gets total difficulty for a block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hash` | `Uint8Array` | the block hash |
| `num` | `bigint` | the block number |

#### Returns

`Promise`\<`bigint`\>

the td

#### Defined in

[packages/blockchain/src/Chain.ts:539](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L539)

___

### hasBlock

▸ **hasBlock**(`block`): `Promise`\<`boolean`\>

Get a block by its hash or number

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `bigint` \| `Uint8Array` | block hash or number |

#### Returns

`Promise`\<`boolean`\>

**`Throws`**

if block is not found

#### Defined in

[packages/blockchain/src/Chain.ts:364](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L364)

___

### open

▸ **open**(): `Promise`\<`boolean` \| `void`\>

Open blockchain and wait for database to load

#### Returns

`Promise`\<`boolean` \| `void`\>

false if chain is already open, otherwise void

#### Defined in

[packages/blockchain/src/Chain.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L260)

___

### putBlocks

▸ **putBlocks**(`blocks`, `fromEngine?`): `Promise`\<`number`\>

Insert new blocks into blockchain

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `blocks` | `Block`[] | `undefined` | list of blocks to add |
| `fromEngine` | `boolean` | `false` | pass true to process post-merge blocks, otherwise they will be skipped |

#### Returns

`Promise`\<`number`\>

number of blocks added

#### Defined in

[packages/blockchain/src/Chain.ts:388](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L388)

___

### putHeaders

▸ **putHeaders**(`headers`, `mergeIncludes?`): `Promise`\<`number`\>

Insert new headers into blockchain

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `headers` | `BlockHeader`[] | `undefined` |  |
| `mergeIncludes` | `boolean` | `false` | skip adding headers after merge |

#### Returns

`Promise`\<`number`\>

number of headers added

#### Defined in

[packages/blockchain/src/Chain.ts:466](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L466)

___

### reset

▸ **reset**(): `void`

Resets _header, _blocks

#### Returns

`void`

#### Defined in

[packages/blockchain/src/Chain.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L209)

___

### resetCanonicalHead

▸ **resetCanonicalHead**(`canonicalHead`): `Promise`\<`boolean` \| `void`\>

Resets the chain to canonicalHead number

#### Parameters

| Name | Type |
| :------ | :------ |
| `canonicalHead` | `bigint` |

#### Returns

`Promise`\<`boolean` \| `void`\>

#### Defined in

[packages/blockchain/src/Chain.ts:281](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L281)

___

### update

▸ **update**(): `Promise`\<`boolean` \| `void`\>

Update blockchain properties (latest block, td, height, etc...)

#### Returns

`Promise`\<`boolean` \| `void`\>

false if chain is closed, otherwise void

#### Defined in

[packages/blockchain/src/Chain.ts:292](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L292)

___

### create

▸ **create**(`options`): `Promise`\<[`Chain`](Chain.md)\>

Safe creation of a Chain object awaiting the initialization
of the underlying Blockchain object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ChainOptions` |

#### Returns

`Promise`\<[`Chain`](Chain.md)\>

#### Defined in

[packages/blockchain/src/Chain.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/Chain.ts#L161)
