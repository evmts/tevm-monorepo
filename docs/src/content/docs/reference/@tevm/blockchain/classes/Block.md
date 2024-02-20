---
editUrl: false
next: false
prev: false
title: "Block"
---

An object that represents the block.

## Constructors

### new Block(header, transactions, uncleHeaders, withdrawals, opts)

> **new Block**(`header`?, `transactions`?, `uncleHeaders`?, `withdrawals`?, `opts`?): [`Block`](/reference/tevm/blockchain/classes/block/)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

▪ **header?**: `BlockHeader`

▪ **transactions?**: `TypedTransaction`[]

▪ **uncleHeaders?**: `BlockHeader`[]

▪ **withdrawals?**: `Withdrawal`[]

▪ **opts?**: `BlockOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:86

## Properties

### cache

> **`private`** **cache**: `any`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:18

***

### common

> **`readonly`** **common**: `Common`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:17

***

### header

> **`readonly`** **header**: `BlockHeader`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:13

***

### transactions

> **`readonly`** **transactions**: `TypedTransaction`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:14

***

### uncleHeaders

> **`readonly`** **uncleHeaders**: `BlockHeader`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:15

***

### withdrawals

> **`readonly`** **withdrawals**?: `Withdrawal`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:16

***

### fromJsonRpcProvider

> **`static`** **fromJsonRpcProvider**: (`provider`, `blockTag`, `opts`) => `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)\>

Method to retrieve a block from a JSON-RPC provider and format as a [Block](/reference/tevm/blockchain/classes/block/)

#### Param

either a url for a remote provider or an Ethers JsonRpcProvider object

#### Param

block hash or block number to be run

#### Param

[BlockOptions]([object Object])

Method to retrieve a block from a JSON-RPC provider and format as a [Block](/reference/tevm/blockchain/classes/block/)

#### Parameters

▪ **provider**: `string` \| `EthersProvider`

either a url for a remote provider or an Ethers JsonRpcProvider object

▪ **blockTag**: `string` \| `bigint`

block hash or block number to be run

▪ **opts**: `BlockOptions`

[BlockOptions]([object Object])

#### Returns

the block specified by `blockTag`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:67

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:180

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

▪ **parentBlock**: [`Block`](/reference/tevm/blockchain/classes/block/)

the parent of this `Block`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:165

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:106

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

an array of error strings

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:117

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:94

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:98

***

### raw()

> **raw**(): `BlockBytes`

Returns a Array of the raw Bytes Arays of this block, in order.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:90

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:102

***

### toJSON()

> **toJSON**(): `JsonBlock`

Returns the block in JSON format.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:176

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

True if all transactions are valid, false otherwise

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:122

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

True if the transaction trie is valid, false otherwise

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:112

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

true if the uncle's hash is valid, false otherwise.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:144

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

▪ **parentHeader**: `BlockHeader`

header of parent block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:139

***

### validateData()

> **validateData**(`onlyHeader`?): `Promise`\<`void`\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

▪ **onlyHeader?**: `boolean`

if only passed the header, skip validating txTrie and unclesHash (default: false)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:132

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

▪ **parentBlock**: [`Block`](/reference/tevm/blockchain/classes/block/)

the parent of this `Block`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:172

***

### validateUncles()

> **validateUncles**(): `void`

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:159

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

true if the withdrawals trie root is valid, false otherwise

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:149

***

### fromBeaconPayloadJson()

> **`static`** **fromBeaconPayloadJson**(`payload`, `options`?): `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)\>

Method to retrieve a block from a beacon payload json

#### Parameters

▪ **payload**: `BeaconPayloadJson`

json of a beacon beacon fetched from beacon apis

▪ **options?**: `BlockOptions`

#### Returns

the block constructed block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:81

***

### fromBlockData()

> **`static`** **fromBlockData**(`blockData`?, `opts`?): [`Block`](/reference/tevm/blockchain/classes/block/)

Static constructor to create a block from a block data dictionary

#### Parameters

▪ **blockData?**: `BlockData`

▪ **opts?**: `BlockOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:37

***

### fromExecutionPayload()

> **`static`** **fromExecutionPayload**(`payload`, `options`?): `Promise`\<[`Block`](/reference/tevm/blockchain/classes/block/)\>

Method to retrieve a block from an execution payload

#### Parameters

▪ **payload**: `ExecutionPayload`

▪ **options?**: `BlockOptions`

#### Returns

the block constructed block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:74

***

### fromRLPSerializedBlock()

> **`static`** **fromRLPSerializedBlock**(`serialized`, `opts`?): [`Block`](/reference/tevm/blockchain/classes/block/)

Static constructor to create a block from a RLP-serialized block

#### Parameters

▪ **serialized**: `Uint8Array`

▪ **opts?**: `BlockOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:44

***

### fromRPC()

> **`static`** **fromRPC**(`blockData`, `uncles`?, `opts`?): [`Block`](/reference/tevm/blockchain/classes/block/)

Creates a new block object from Ethereum JSON RPC.

#### Parameters

▪ **blockData**: `JsonRpcBlock`

▪ **uncles?**: `any`[]

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

▪ **opts?**: `BlockOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:59

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`?): [`Block`](/reference/tevm/blockchain/classes/block/)

Static constructor to create a block from an array of Bytes values

#### Parameters

▪ **values**: `BlockBytes`

▪ **opts?**: `BlockOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:51

***

### genTransactionsTrieRoot()

> **`static`** **genTransactionsTrieRoot**(`txs`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

▪ **txs**: `TypedTransaction`[]

array of TypedTransaction to compute the root of

▪ **emptyTrie?**: `Trie`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:30

***

### genWithdrawalsTrieRoot()

> **`static`** **genWithdrawalsTrieRoot**(`wts`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

▪ **wts**: `Withdrawal`[]

array of Withdrawal to compute the root of

▪ **emptyTrie?**: `Trie`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.0.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:24

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
