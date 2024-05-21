[**@tevm/block**](../README.md) • **Docs**

***

[@tevm/block](../globals.md) / Block

# Class: Block

An object that represents the block.

## Constructors

### new Block()

> **new Block**(`opts`, `header`?, `transactions`?, `uncleHeaders`?, `withdrawals`?, `requests`?, `executionWitness`?): [`Block`](Block.md)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

• **header?**: [`BlockHeader`](BlockHeader.md)

• **transactions?**: `TypedTransaction`[]= `[]`

• **uncleHeaders?**: [`BlockHeader`](BlockHeader.md)[]= `[]`

• **withdrawals?**: `Withdrawal`[]

• **requests?**: [`ClRequest`](ClRequest.md)[]

• **executionWitness?**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

#### Returns

[`Block`](Block.md)

#### Source

[block.ts:328](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L328)

## Properties

### cache

> `protected` **cache**: `object` = `{}`

#### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

#### txTrieRoot?

> `optional` **txTrieRoot**: `Uint8Array`

#### withdrawalsTrieRoot?

> `optional` **withdrawalsTrieRoot**: `Uint8Array`

#### Source

[block.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L55)

***

### common

> `readonly` **common**: `Common`

#### Source

[block.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L45)

***

### executionWitness?

> `optional` `readonly` **executionWitness**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Source

[block.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L53)

***

### header

> `readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Source

[block.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L40)

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Source

[block.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L46)

***

### requests?

> `optional` `readonly` **requests**: [`ClRequest`](ClRequest.md)[]

#### Source

[block.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L44)

***

### transactions

> `readonly` **transactions**: `TypedTransaction`[] = `[]`

#### Source

[block.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L41)

***

### uncleHeaders

> `readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

#### Source

[block.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L42)

***

### withdrawals?

> `optional` `readonly` **withdrawals**: `Withdrawal`[]

#### Source

[block.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L43)

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Source

[block.ts:795](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L795)

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

• **parentBlock**: [`Block`](Block.md)

the parent of this `Block`

#### Returns

`bigint`

#### Source

[block.ts:729](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L729)

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[block.ts:449](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L449)

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Source

[block.ts:495](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L495)

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Source

[block.ts:428](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L428)

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Source

[block.ts:435](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L435)

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

#### Source

[block.ts:406](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L406)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Source

[block.ts:472](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L472)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Source

[block.ts:442](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L442)

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Source

[block.ts:761](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L761)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Source

[block.ts:746](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L746)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Source

[block.ts:545](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L545)

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Source

[block.ts:458](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L458)

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Source

[block.ts:662](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L662)

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

• **parentHeader**: [`BlockHeader`](BlockHeader.md)

header of parent block

#### Returns

`void`

#### Source

[block.ts:616](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L616)

***

### validateData()

> **validateData**(`onlyHeader`, `verifyTxs`): `Promise`\<`void`\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

• **onlyHeader**: `boolean`= `false`

if only passed the header, skip validating txTrie and unclesHash (default: false)

• **verifyTxs**: `boolean`= `true`

if set to `false`, will not check for transaction validation errors (default: true)

#### Returns

`Promise`\<`void`\>

#### Source

[block.ts:561](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L561)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

• **parentBlock**: [`Block`](Block.md)

the parent of this `Block`

#### Returns

`void`

#### Source

[block.ts:739](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L739)

***

### validateUncles()

> **validateUncles**(): `void`

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Returns

`void`

#### Source

[block.ts:705](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L705)

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Source

[block.ts:675](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L675)

***

### fromBeaconPayloadJson()

> `static` **fromBeaconPayloadJson**(`payload`, `opts`): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from a beacon payload json

#### Parameters

• **payload**: [`BeaconPayloadJson`](../type-aliases/BeaconPayloadJson.md)

json of a beacon beacon fetched from beacon apis

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

#### Returns

`Promise`\<[`Block`](Block.md)\>

the block constructed block

#### Source

[block.ts:319](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L319)

***

### fromBlockData()

> `static` **fromBlockData**(`blockData`, `opts`): [`Block`](Block.md)

Static constructor to create a block from a block data dictionary

#### Parameters

• **blockData**: [`BlockData`](../interfaces/BlockData.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`Block`](Block.md)

#### Source

[block.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L109)

***

### fromExecutionPayload()

> `static` **fromExecutionPayload**(`payload`, `opts`): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from an execution payload

#### Parameters

• **payload**: [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

#### Returns

`Promise`\<[`Block`](Block.md)\>

the block constructed block

#### Source

[block.ts:257](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L257)

***

### fromRLPSerializedBlock()

> `static` **fromRLPSerializedBlock**(`serialized`, `opts`): [`Block`](Block.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

• **serialized**: `Uint8Array`

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`Block`](Block.md)

#### Source

[block.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L161)

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`): [`Block`](Block.md)

Static constructor to create a block from an array of Bytes values

#### Parameters

• **values**: [`BlockBytes`](../type-aliases/BlockBytes.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`Block`](Block.md)

#### Source

[block.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L177)

***

### genRequestsTrieRoot()

> `static` **genRequestsTrieRoot**(`requests`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the requests trie root for an array of CLRequests

#### Parameters

• **requests**: [`ClRequest`](ClRequest.md)[]

an array of CLRequests

• **emptyTrie?**: `Trie`

optional empty trie used to generate the root

#### Returns

`Promise`\<`Uint8Array`\>

a 32 byte Uint8Array representing the requests trie root

#### Source

[block.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L93)

***

### genTransactionsTrieRoot()

> `static` **genTransactionsTrieRoot**(`txs`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

• **txs**: `TypedTransaction`[]

array of TypedTransaction to compute the root of

• **emptyTrie?**: `Trie`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[block.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L79)

***

### genWithdrawalsTrieRoot()

> `static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

• **wts**: `Withdrawal`[]

array of Withdrawal to compute the root of

• **emptyTrie?**: `Trie`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[block.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L66)
