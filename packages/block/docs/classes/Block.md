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

[block.ts:331](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L331)

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

[block.ts:798](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L798)

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

[block.ts:732](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L732)

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

[block.ts:452](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L452)

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Source

[block.ts:498](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L498)

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Source

[block.ts:431](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L431)

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Source

[block.ts:438](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L438)

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

#### Source

[block.ts:409](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L409)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Source

[block.ts:475](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L475)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Source

[block.ts:445](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L445)

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Source

[block.ts:764](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L764)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Source

[block.ts:749](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L749)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Source

[block.ts:548](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L548)

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Source

[block.ts:461](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L461)

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Source

[block.ts:665](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L665)

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

[block.ts:619](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L619)

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

[block.ts:564](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L564)

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

[block.ts:742](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L742)

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

[block.ts:708](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L708)

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Source

[block.ts:678](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L678)

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

[block.ts:322](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L322)

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

[block.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L260)

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

[block.ts:164](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L164)

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

[block.ts:180](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L180)

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
