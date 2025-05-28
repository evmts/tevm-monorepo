[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / Block

# Class: Block

Defined in: packages/block/types/block.d.ts:12

An object that represents the block.

## Constructors

### Constructor

> **new Block**(`opts`, `header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `requests?`, `executionWitness?`): `Block`

Defined in: packages/block/types/block.d.ts:92

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

##### header?

[`BlockHeader`](BlockHeader.md)

##### transactions?

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

##### uncleHeaders?

[`BlockHeader`](BlockHeader.md)[]

##### withdrawals?

[`Withdrawal`](../../utils/classes/Withdrawal.md)[]

##### requests?

[`ClRequest`](ClRequest.md)[]

##### executionWitness?

`null` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

#### Returns

`Block`

## Properties

### cache

> `protected` **cache**: `object`

Defined in: packages/block/types/block.d.ts:26

#### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`\<`ArrayBufferLike`\>

#### txTrieRoot?

> `optional` **txTrieRoot**: `Uint8Array`\<`ArrayBufferLike`\>

#### withdrawalsTrieRoot?

> `optional` **withdrawalsTrieRoot**: `Uint8Array`\<`ArrayBufferLike`\>

***

### common

> `readonly` **common**: `object`

Defined in: packages/block/types/block.d.ts:18

#### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

##### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

##### blockExplorers.default

> **default**: `ChainBlockExplorer`

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

##### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

##### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

##### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

##### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

##### contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

> **ethjsCommon**: `Common`

#### fees?

> `optional` **fees**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

#### formatters?

> `optional` **formatters**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

#### id

> **id**: `number`

ID in number form

#### name

> **name**: `string`

Human-readable name

#### nativeCurrency

> **nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

#### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

##### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

##### rpcUrls.default

> **default**: `ChainRpcUrls`

#### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

#### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

***

### executionWitness?

> `readonly` `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

Defined in: packages/block/types/block.d.ts:25

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

***

### header

> `readonly` **header**: [`BlockHeader`](BlockHeader.md)

Defined in: packages/block/types/block.d.ts:13

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

Defined in: packages/block/types/block.d.ts:19

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### requests?

> `readonly` `optional` **requests**: [`ClRequest`](ClRequest.md)[]

Defined in: packages/block/types/block.d.ts:17

***

### transactions

> `readonly` **transactions**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

Defined in: packages/block/types/block.d.ts:14

***

### uncleHeaders

> `readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[]

Defined in: packages/block/types/block.d.ts:15

***

### withdrawals?

> `readonly` `optional` **withdrawals**: [`Withdrawal`](../../utils/classes/Withdrawal.md)[]

Defined in: packages/block/types/block.d.ts:16

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: packages/block/types/block.d.ts:189

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Defined in: packages/block/types/block.d.ts:173

Returns the canonical difficulty for this block.

#### Parameters

##### parentBlock

`Block`

the parent of this `Block`

#### Returns

`bigint`

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/block/types/block.d.ts:112

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Defined in: packages/block/types/block.d.ts:124

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

***

### hash()

> **hash**(): `Uint8Array`

Defined in: packages/block/types/block.d.ts:100

Returns the hash of the block.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Defined in: packages/block/types/block.d.ts:104

Determines if this block is the genesis block.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Defined in: packages/block/types/block.d.ts:96

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: packages/block/types/block.d.ts:119

#### Returns

`Promise`\<`boolean`\>

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: packages/block/types/block.d.ts:108

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Defined in: packages/block/types/block.d.ts:185

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Defined in: packages/block/types/block.d.ts:184

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Defined in: packages/block/types/block.d.ts:129

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: packages/block/types/block.d.ts:118

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Defined in: packages/block/types/block.d.ts:152

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Defined in: packages/block/types/block.d.ts:147

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

##### parentHeader

[`BlockHeader`](BlockHeader.md)

header of parent block

#### Returns

`void`

***

### validateData()

> **validateData**(`onlyHeader?`, `verifyTxs?`): `Promise`\<`void`\>

Defined in: packages/block/types/block.d.ts:140

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

##### onlyHeader?

`boolean`

if only passed the header, skip validating txTrie and unclesHash (default: false)

##### verifyTxs?

`boolean`

if set to `false`, will not check for transaction validation errors (default: true)

#### Returns

`Promise`\<`void`\>

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Defined in: packages/block/types/block.d.ts:180

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

##### parentBlock

`Block`

the parent of this `Block`

#### Returns

`void`

***

### validateUncles()

> **validateUncles**(): `void`

Defined in: packages/block/types/block.d.ts:167

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Returns

`void`

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: packages/block/types/block.d.ts:157

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

***

### fromBeaconPayloadJson()

> `static` **fromBeaconPayloadJson**(`payload`, `opts`): `Promise`\<`Block`\>

Defined in: packages/block/types/block.d.ts:87

Method to retrieve a block from a beacon payload json

#### Parameters

##### payload

[`BeaconPayloadJson`](../type-aliases/BeaconPayloadJson.md)

json of a beacon beacon fetched from beacon apis

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

#### Returns

`Promise`\<`Block`\>

the block constructed block

***

### ~~fromBlockData()~~

> `static` **fromBlockData**(`blockData`, `opts`): `Block`

Defined in: packages/block/types/block.d.ts:57

Static constructor to create a block from a block data dictionary

#### Parameters

##### blockData

[`BlockData`](../interfaces/BlockData.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`Block`

#### Deprecated

Use createBlock() instead - this method is kept for compatibility

***

### fromExecutionPayload()

> `static` **fromExecutionPayload**(`payload`, `opts`): `Promise`\<`Block`\>

Defined in: packages/block/types/block.d.ts:80

Method to retrieve a block from an execution payload

#### Parameters

##### payload

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

#### Returns

`Promise`\<`Block`\>

the block constructed block

***

### ~~fromRLPSerializedBlock()~~

> `static` **fromRLPSerializedBlock**(`serialized`, `opts`): `Block`

Defined in: packages/block/types/block.d.ts:65

Static constructor to create a block from a RLP-serialized block

#### Parameters

##### serialized

`Uint8Array`

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`Block`

#### Deprecated

Use createBlockFromRLP() instead - this method is kept for compatibility

***

### ~~fromValuesArray()~~

> `static` **fromValuesArray**(`values`, `opts`): `Block`

Defined in: packages/block/types/block.d.ts:73

Static constructor to create a block from an array of Bytes values

#### Parameters

##### values

[`BlockBytes`](../type-aliases/BlockBytes.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`Block`

#### Deprecated

Use createBlockFromValuesArray() instead - this method is kept for compatibility

***

### genRequestsTrieRoot()

> `static` **genRequestsTrieRoot**(`requests`, `emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/block/types/block.d.ts:49

Returns the requests trie root for an array of CLRequests

#### Parameters

##### requests

[`ClRequest`](ClRequest.md)[]

an array of CLRequests

##### emptyTrie?

`Trie`

optional empty trie used to generate the root

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

a 32 byte Uint8Array representing the requests trie root

***

### genTransactionsTrieRoot()

> `static` **genTransactionsTrieRoot**(`txs`, `emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/block/types/block.d.ts:42

Returns the txs trie root for array of TypedTransaction

#### Parameters

##### txs

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

array of TypedTransaction to compute the root of

##### emptyTrie?

`Trie`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### genWithdrawalsTrieRoot()

> `static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/block/types/block.d.ts:36

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

##### wts

[`Withdrawal`](../../utils/classes/Withdrawal.md)[]

array of Withdrawal to compute the root of

##### emptyTrie?

`Trie`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
