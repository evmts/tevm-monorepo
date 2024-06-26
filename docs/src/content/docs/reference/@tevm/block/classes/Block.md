---
editUrl: false
next: false
prev: false
title: "Block"
---

An object that represents the block.

## Constructors

### new Block()

> **new Block**(`opts`, `header`?, `transactions`?, `uncleHeaders`?, `withdrawals`?, `requests`?, `executionWitness`?): [`Block`](/reference/tevm/block/classes/block/)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

• **opts**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

• **header?**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

• **transactions?**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/)[] = `[]`

• **uncleHeaders?**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)[] = `[]`

• **withdrawals?**: [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)[]

• **requests?**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

• **executionWitness?**: `null` \| [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

#### Returns

[`Block`](/reference/tevm/block/classes/block/)

#### Defined in

[block.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L334)

## Properties

### cache

> `protected` **cache**: `object` = `{}`

#### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

#### txTrieRoot?

> `optional` **txTrieRoot**: `Uint8Array`

#### withdrawalsTrieRoot?

> `optional` **withdrawalsTrieRoot**: `Uint8Array`

#### Defined in

[block.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L55)

***

### common

> `readonly` **common**: [`Common`](/reference/tevm/common/type-aliases/common/)

#### Defined in

[block.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L45)

***

### executionWitness?

> `readonly` `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Defined in

[block.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L53)

***

### header

> `readonly` **header**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

#### Defined in

[block.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L40)

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[block.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L46)

***

### requests?

> `readonly` `optional` **requests**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

#### Defined in

[block.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L44)

***

### transactions

> `readonly` **transactions**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/)[] = `[]`

#### Defined in

[block.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L41)

***

### uncleHeaders

> `readonly` **uncleHeaders**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)[] = `[]`

#### Defined in

[block.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L42)

***

### withdrawals?

> `readonly` `optional` **withdrawals**: [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)[]

#### Defined in

[block.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L43)

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[block.ts:801](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L801)

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

• **parentBlock**: [`Block`](/reference/tevm/block/classes/block/)

the parent of this `Block`

#### Returns

`bigint`

#### Defined in

[block.ts:735](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L735)

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[block.ts:455](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L455)

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Defined in

[block.ts:501](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L501)

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Defined in

[block.ts:434](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L434)

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

[block.ts:441](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L441)

***

### raw()

> **raw**(): [`BlockBytes`](/reference/tevm/block/type-aliases/blockbytes/)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](/reference/tevm/block/type-aliases/blockbytes/)

#### Defined in

[block.ts:412](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L412)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[block.ts:478](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L478)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Defined in

[block.ts:448](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L448)

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](/reference/tevm/block/type-aliases/executionpayload/)

#### Returns

[`ExecutionPayload`](/reference/tevm/block/type-aliases/executionpayload/)

#### Defined in

[block.ts:767](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L767)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](/reference/tevm/block/interfaces/jsonblock/)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](/reference/tevm/block/interfaces/jsonblock/)

#### Defined in

[block.ts:752](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L752)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Defined in

[block.ts:551](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L551)

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Defined in

[block.ts:464](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L464)

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Defined in

[block.ts:668](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L668)

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

• **parentHeader**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

header of parent block

#### Returns

`void`

#### Defined in

[block.ts:622](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L622)

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

• **onlyHeader**: `boolean` = `false`

if only passed the header, skip validating txTrie and unclesHash (default: false)

• **verifyTxs**: `boolean` = `true`

if set to `false`, will not check for transaction validation errors (default: true)

#### Returns

`Promise`\<`void`\>

#### Defined in

[block.ts:567](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L567)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

• **parentBlock**: [`Block`](/reference/tevm/block/classes/block/)

the parent of this `Block`

#### Returns

`void`

#### Defined in

[block.ts:745](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L745)

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

#### Defined in

[block.ts:711](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L711)

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Defined in

[block.ts:681](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L681)

***

### fromBeaconPayloadJson()

> `static` **fromBeaconPayloadJson**(`payload`, `opts`): `Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

Method to retrieve a block from a beacon payload json

#### Parameters

• **payload**: [`BeaconPayloadJson`](/reference/tevm/block/type-aliases/beaconpayloadjson/)

json of a beacon beacon fetched from beacon apis

• **opts**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

[BlockOptions](../../../../../../../reference/tevm/block/interfaces/blockoptions)

#### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

the block constructed block

#### Defined in

[block.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L325)

***

### fromBlockData()

> `static` **fromBlockData**(`blockData`, `opts`): [`Block`](/reference/tevm/block/classes/block/)

Static constructor to create a block from a block data dictionary

#### Parameters

• **blockData**: [`BlockData`](/reference/tevm/block/interfaces/blockdata/)

• **opts**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

#### Returns

[`Block`](/reference/tevm/block/classes/block/)

#### Defined in

[block.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L109)

***

### fromExecutionPayload()

> `static` **fromExecutionPayload**(`payload`, `opts`): `Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

Method to retrieve a block from an execution payload

#### Parameters

• **payload**: [`ExecutionPayload`](/reference/tevm/block/type-aliases/executionpayload/)

• **opts**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

[BlockOptions](../../../../../../../reference/tevm/block/interfaces/blockoptions)

#### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

the block constructed block

#### Defined in

[block.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L260)

***

### fromRLPSerializedBlock()

> `static` **fromRLPSerializedBlock**(`serialized`, `opts`): [`Block`](/reference/tevm/block/classes/block/)

Static constructor to create a block from a RLP-serialized block

#### Parameters

• **serialized**: `Uint8Array`

• **opts**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

#### Returns

[`Block`](/reference/tevm/block/classes/block/)

#### Defined in

[block.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L161)

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`): [`Block`](/reference/tevm/block/classes/block/)

Static constructor to create a block from an array of Bytes values

#### Parameters

• **values**: [`BlockBytes`](/reference/tevm/block/type-aliases/blockbytes/)

• **opts**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

#### Returns

[`Block`](/reference/tevm/block/classes/block/)

#### Defined in

[block.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L177)

***

### genRequestsTrieRoot()

> `static` **genRequestsTrieRoot**(`requests`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the requests trie root for an array of CLRequests

#### Parameters

• **requests**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

an array of CLRequests

• **emptyTrie?**: [`Trie`](/reference/tevm/trie/classes/trie/)

optional empty trie used to generate the root

#### Returns

`Promise`\<`Uint8Array`\>

a 32 byte Uint8Array representing the requests trie root

#### Defined in

[block.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L93)

***

### genTransactionsTrieRoot()

> `static` **genTransactionsTrieRoot**(`txs`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

• **txs**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/)[]

array of TypedTransaction to compute the root of

• **emptyTrie?**: [`Trie`](/reference/tevm/trie/classes/trie/)

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[block.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L79)

***

### genWithdrawalsTrieRoot()

> `static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

• **wts**: [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)[]

array of Withdrawal to compute the root of

• **emptyTrie?**: [`Trie`](/reference/tevm/trie/classes/trie/)

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[block.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L66)
