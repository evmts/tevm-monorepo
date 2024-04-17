**@tevm/block** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/block](../README.md) / Block

# Class: Block

An object that represents the block.

## Constructors

### new Block(header, transactions, uncleHeaders, withdrawals, opts, executionWitness)

> **new Block**(`header`?, `transactions`?, `uncleHeaders`?, `withdrawals`?, `opts`?, `executionWitness`?): [`Block`](Block.md)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

• **header?**: [`BlockHeader`](BlockHeader.md)

• **transactions?**: `TypedTransaction`[]

• **uncleHeaders?**: [`BlockHeader`](BlockHeader.md)[]

• **withdrawals?**: `Withdrawal`[]

• **opts?**: `BlockOptions`

• **executionWitness?**: `null` \| `VerkleExecutionWitness`

#### Returns

[`Block`](Block.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:95

## Properties

### cache

> **`protected`** **cache**: `object`

#### txTrieRoot?

> **`optional`** **txTrieRoot**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:25

***

### common

> **`readonly`** **common**: `Common`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:17

***

### executionWitness?

> **`optional`** **`readonly`** **executionWitness**: `null` \| `VerkleExecutionWitness`

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:24

***

### header

> **`readonly`** **header**: [`BlockHeader`](BlockHeader.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:13

***

### keccakFunction()

> **`protected`** **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:18

***

### transactions

> **`readonly`** **transactions**: `TypedTransaction`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:14

***

### uncleHeaders

> **`readonly`** **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:15

***

### withdrawals?

> **`optional`** **`readonly`** **withdrawals**: `Withdrawal`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:16

***

### fromJsonRpcProvider()

> **`static`** **fromJsonRpcProvider**: (`provider`, `blockTag`, `opts`) => `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from a JSON-RPC provider and format as a [Block](Block.md)

#### Parameters

• **provider**: `string` \| `EthersProvider`

either a url for a remote provider or an Ethers JsonRpcProvider object

• **blockTag**: `string` \| `bigint`

block hash or block number to be run

• **opts**: `BlockOptions`

BlockOptions

#### Returns

`Promise`\<[`Block`](Block.md)\>

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:76

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:190

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

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:175

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:115

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:126

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:103

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:107

***

### raw()

> **raw**(): `BlockBytes`

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

`BlockBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:99

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:111

***

### toJSON()

> **toJSON**(): `JsonBlock`

Returns the block in JSON format.

#### Returns

`JsonBlock`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:186

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:131

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:121

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:154

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

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:149

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

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:142

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

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:182

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

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:169

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:159

***

### fromBeaconPayloadJson()

> **`static`** **fromBeaconPayloadJson**(`payload`, `opts`?): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from a beacon payload json

#### Parameters

• **payload**: `BeaconPayloadJson`

json of a beacon beacon fetched from beacon apis

• **opts?**: `BlockOptions`

BlockOptions

#### Returns

`Promise`\<[`Block`](Block.md)\>

the block constructed block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:90

***

### fromBlockData()

> **`static`** **fromBlockData**(`blockData`?, `opts`?): [`Block`](Block.md)

Static constructor to create a block from a block data dictionary

#### Parameters

• **blockData?**: `BlockData`

• **opts?**: `BlockOptions`

#### Returns

[`Block`](Block.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:46

***

### fromExecutionPayload()

> **`static`** **fromExecutionPayload**(`payload`, `opts`?): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from an execution payload

#### Parameters

• **payload**: `ExecutionPayload`

• **opts?**: `BlockOptions`

BlockOptions

#### Returns

`Promise`\<[`Block`](Block.md)\>

the block constructed block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:83

***

### fromRLPSerializedBlock()

> **`static`** **fromRLPSerializedBlock**(`serialized`, `opts`?): [`Block`](Block.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

• **serialized**: `Uint8Array`

• **opts?**: `BlockOptions`

#### Returns

[`Block`](Block.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:53

***

### fromRPC()

> **`static`** **fromRPC**(`blockData`, `uncles`?, `opts`?): [`Block`](Block.md)

Creates a new block object from Ethereum JSON RPC.

#### Parameters

• **blockData**: `JsonRpcBlock`

• **uncles?**: `any`[]

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

• **opts?**: `BlockOptions`

An object describing the blockchain

#### Returns

[`Block`](Block.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:68

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`?): [`Block`](Block.md)

Static constructor to create a block from an array of Bytes values

#### Parameters

• **values**: `BlockBytes`

• **opts?**: `BlockOptions`

#### Returns

[`Block`](Block.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:60

***

### genTransactionsTrieRoot()

> **`static`** **genTransactionsTrieRoot**(`txs`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

• **txs**: `TypedTransaction`[]

array of TypedTransaction to compute the root of

• **emptyTrie?**: `Trie`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:39

***

### genWithdrawalsTrieRoot()

> **`static`** **genWithdrawalsTrieRoot**(`wts`, `emptyTrie`?): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

• **wts**: `Withdrawal`[]

array of Withdrawal to compute the root of

• **emptyTrie?**: `Trie`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/block.d.ts:33
