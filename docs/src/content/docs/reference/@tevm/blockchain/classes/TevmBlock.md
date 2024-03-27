---
editUrl: false
next: false
prev: false
title: "TevmBlock"
---

## Extends

- `Block`

## Constructors

### new TevmBlock(header, transactions, uncleHeaders, withdrawals, opts, executionWitness)

> **new TevmBlock**(`header`?, `transactions`?, `uncleHeaders`?, `withdrawals`?, `opts`?, `executionWitness`?): [`TevmBlock`](/reference/tevm/blockchain/classes/tevmblock/)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

▪ **header?**: `BlockHeader`

▪ **transactions?**: `TypedTransaction`[]

▪ **uncleHeaders?**: `BlockHeader`[]

▪ **withdrawals?**: `Withdrawal`[]

▪ **opts?**: `BlockOptions`

▪ **executionWitness?**: `null` \| `VerkleExecutionWitness`

#### Inherited from

Block.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:95

## Properties

### cache

> **`protected`** **cache**: `object`

#### Type declaration

##### txTrieRoot

> **txTrieRoot**?: `Uint8Array`

#### Inherited from

Block.cache

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:25

***

### common

> **`readonly`** **common**: `Common`

#### Inherited from

Block.common

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:17

***

### executionWitness

> **`readonly`** **executionWitness**?: `null` \| `VerkleExecutionWitness`

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Inherited from

Block.executionWitness

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:24

***

### header

> **`readonly`** **header**: `BlockHeader`

#### Inherited from

Block.header

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:13

***

### keccakFunction

> **`protected`** **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

▪ **msg**: `Uint8Array`

#### Inherited from

Block.keccakFunction

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:18

***

### transactions

> **`readonly`** **transactions**: `TypedTransaction`[]

#### Inherited from

Block.transactions

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:14

***

### uncleHeaders

> **`readonly`** **uncleHeaders**: `BlockHeader`[]

#### Inherited from

Block.uncleHeaders

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:15

***

### withdrawals

> **`readonly`** **withdrawals**?: `Withdrawal`[]

#### Inherited from

Block.withdrawals

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:16

***

### fromJsonRpcProvider

> **`static`** **fromJsonRpcProvider**: (`provider`, `blockTag`, `opts`) => `Promise`\<`Block`\>

Method to retrieve a block from a JSON-RPC provider and format as a [Block]([object Object])

#### Param

either a url for a remote provider or an Ethers JsonRpcProvider object

#### Param

block hash or block number to be run

#### Param

[BlockOptions]([object Object])

Method to retrieve a block from a JSON-RPC provider and format as a [Block]([object Object])

#### Parameters

▪ **provider**: `string` \| `EthersProvider`

either a url for a remote provider or an Ethers JsonRpcProvider object

▪ **blockTag**: `string` \| `bigint`

block hash or block number to be run

▪ **opts**: `BlockOptions`

[BlockOptions]([object Object])

#### Returns

the block specified by `blockTag`

#### Inherited from

Block.fromJsonRpcProvider

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:76

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Inherited from

Block.errorStr

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:190

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

▪ **parentBlock**: `Block`

the parent of this `Block`

#### Inherited from

Block.ethashCanonicalDifficulty

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:175

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Inherited from

Block.genTxTrie

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:115

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

an array of error strings

#### Inherited from

Block.getTransactionsValidationErrors

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:126

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Inherited from

Block.hash

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:103

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Inherited from

Block.isGenesis

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:107

***

### raw()

> **raw**(): `BlockBytes`

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Inherited from

Block.raw

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:99

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Inherited from

Block.serialize

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:111

***

### toJSON()

> **toJSON**(): `JsonBlock`

Returns the block in JSON format.

#### Inherited from

Block.toJSON

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:186

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

True if all transactions are valid, false otherwise

#### Inherited from

Block.transactionsAreValid

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:131

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

True if the transaction trie is valid, false otherwise

#### Inherited from

Block.transactionsTrieIsValid

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:121

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

true if the uncle's hash is valid, false otherwise.

#### Inherited from

Block.uncleHashIsValid

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:154

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

▪ **parentHeader**: `BlockHeader`

header of parent block

#### Inherited from

Block.validateBlobTransactions

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:149

***

### validateData()

> **validateData**(`onlyHeader`?, `verifyTxs`?): `Promise`\<`void`\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

▪ **onlyHeader?**: `boolean`

if only passed the header, skip validating txTrie and unclesHash (default: false)

▪ **verifyTxs?**: `boolean`

if set to `false`, will not check for transaction validation errors (default: true)

#### Inherited from

Block.validateData

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:142

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

▪ **parentBlock**: `Block`

the parent of this `Block`

#### Inherited from

Block.validateGasLimit

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:182

***

### validateUncles()

> **validateUncles**(): `void`

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Inherited from

Block.validateUncles

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:169

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

true if the withdrawals trie root is valid, false otherwise

#### Inherited from

Block.withdrawalsTrieIsValid

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:159

***

### fromBeaconPayloadJson()

> **`static`** **fromBeaconPayloadJson**(`payload`, `opts`?): `Promise`\<`Block`\>

Method to retrieve a block from a beacon payload json

#### Parameters

▪ **payload**: `BeaconPayloadJson`

json of a beacon beacon fetched from beacon apis

▪ **opts?**: `BlockOptions`

[BlockOptions]([object Object])

#### Returns

the block constructed block

#### Inherited from

Block.fromBeaconPayloadJson

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:90

***

### fromBlockData()

> **`static`** **fromBlockData**(`blockData`?, `opts`?): `Block`

Static constructor to create a block from a block data dictionary

#### Parameters

▪ **blockData?**: `BlockData`

▪ **opts?**: `BlockOptions`

#### Inherited from

Block.fromBlockData

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:46

***

### fromExecutionPayload()

> **`static`** **fromExecutionPayload**(`payload`, `opts`?): `Promise`\<`Block`\>

Method to retrieve a block from an execution payload

#### Parameters

▪ **payload**: `ExecutionPayload`

▪ **opts?**: `BlockOptions`

[BlockOptions]([object Object])

#### Returns

the block constructed block

#### Inherited from

Block.fromExecutionPayload

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:83

***

### fromRLPSerializedBlock()

> **`static`** **fromRLPSerializedBlock**(`serialized`, `opts`?): `Block`

Static constructor to create a block from a RLP-serialized block

#### Parameters

▪ **serialized**: `Uint8Array`

▪ **opts?**: `BlockOptions`

#### Inherited from

Block.fromRLPSerializedBlock

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:53

***

### fromRPC()

> **`static`** **fromRPC**(`blockData`, `uncles`?, `opts`?): `Block`

Creates a new block object from Ethereum JSON RPC.

#### Parameters

▪ **blockData**: `JsonRpcBlock`

▪ **uncles?**: `any`[]

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

▪ **opts?**: `BlockOptions`

An object describing the blockchain

#### Inherited from

Block.fromRPC

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:68

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`?): `Block`

Static constructor to create a block from an array of Bytes values

#### Parameters

▪ **values**: `BlockBytes`

▪ **opts?**: `BlockOptions`

#### Inherited from

Block.fromValuesArray

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:60

***

### genTransactionsTrieRoot()

> **`static`** **genTransactionsTrieRoot**(`txs`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

▪ **txs**: `TypedTransaction`[]

array of TypedTransaction to compute the root of

▪ **emptyTrie?**: `Trie`

#### Inherited from

Block.genTransactionsTrieRoot

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:39

***

### genWithdrawalsTrieRoot()

> **`static`** **genWithdrawalsTrieRoot**(`wts`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

▪ **wts**: `Withdrawal`[]

array of Withdrawal to compute the root of

▪ **emptyTrie?**: `Trie`

#### Inherited from

Block.genWithdrawalsTrieRoot

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.1.1/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:33

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
