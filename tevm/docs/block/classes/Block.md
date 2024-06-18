[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [block](../README.md) / Block

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

• **transactions?**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

• **uncleHeaders?**: [`BlockHeader`](BlockHeader.md)[]

• **withdrawals?**: [`Withdrawal`](../../utils/classes/Withdrawal.md)[]

• **requests?**: [`ClRequest`](ClRequest.md)[]

• **executionWitness?**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

#### Returns

[`Block`](Block.md)

#### Source

packages/block/types/block.d.ts:89

## Properties

### cache

> `protected` **cache**: `object`

#### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

#### txTrieRoot?

> `optional` **txTrieRoot**: `Uint8Array`

#### withdrawalsTrieRoot?

> `optional` **withdrawalsTrieRoot**: `Uint8Array`

#### Source

packages/block/types/block.d.ts:26

***

### common

> `readonly` **common**: [`Common`](../../common/type-aliases/Common.md)

#### Source

packages/block/types/block.d.ts:18

***

### executionWitness?

> `optional` `readonly` **executionWitness**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Source

packages/block/types/block.d.ts:25

***

### header

> `readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Source

packages/block/types/block.d.ts:13

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Source

packages/block/types/block.d.ts:19

***

### requests?

> `optional` `readonly` **requests**: [`ClRequest`](ClRequest.md)[]

#### Source

packages/block/types/block.d.ts:17

***

### transactions

> `readonly` **transactions**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

#### Source

packages/block/types/block.d.ts:14

***

### uncleHeaders

> `readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[]

#### Source

packages/block/types/block.d.ts:15

***

### withdrawals?

> `optional` `readonly` **withdrawals**: [`Withdrawal`](../../utils/classes/Withdrawal.md)[]

#### Source

packages/block/types/block.d.ts:16

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Source

packages/block/types/block.d.ts:186

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

packages/block/types/block.d.ts:170

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

packages/block/types/block.d.ts:109

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Source

packages/block/types/block.d.ts:121

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Source

packages/block/types/block.d.ts:97

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Source

packages/block/types/block.d.ts:101

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

#### Source

packages/block/types/block.d.ts:93

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Source

packages/block/types/block.d.ts:116

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Source

packages/block/types/block.d.ts:105

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Source

packages/block/types/block.d.ts:182

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Source

packages/block/types/block.d.ts:181

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Source

packages/block/types/block.d.ts:126

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Source

packages/block/types/block.d.ts:115

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Source

packages/block/types/block.d.ts:149

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

packages/block/types/block.d.ts:144

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

• **onlyHeader?**: `boolean`

if only passed the header, skip validating txTrie and unclesHash (default: false)

• **verifyTxs?**: `boolean`

if set to `false`, will not check for transaction validation errors (default: true)

#### Returns

`Promise`\<`void`\>

#### Source

packages/block/types/block.d.ts:137

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

packages/block/types/block.d.ts:177

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

packages/block/types/block.d.ts:164

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Source

packages/block/types/block.d.ts:154

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

packages/block/types/block.d.ts:84

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

packages/block/types/block.d.ts:56

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

packages/block/types/block.d.ts:77

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

packages/block/types/block.d.ts:63

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

packages/block/types/block.d.ts:70

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

packages/block/types/block.d.ts:49

***

### genTransactionsTrieRoot()

> `static` **genTransactionsTrieRoot**(`txs`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

• **txs**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

array of TypedTransaction to compute the root of

• **emptyTrie?**: `Trie`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

packages/block/types/block.d.ts:42

***

### genWithdrawalsTrieRoot()

> `static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

• **wts**: [`Withdrawal`](../../utils/classes/Withdrawal.md)[]

array of Withdrawal to compute the root of

• **emptyTrie?**: `Trie`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

packages/block/types/block.d.ts:36
