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

• **transactions?**: `TypedTransaction`[] = `[]`

• **uncleHeaders?**: [`BlockHeader`](BlockHeader.md)[] = `[]`

• **withdrawals?**: `Withdrawal`[]

• **requests?**: [`ClRequest`](ClRequest.md)[]

• **executionWitness?**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

#### Returns

[`Block`](Block.md)

#### Defined in

[packages/block/src/block.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L334)

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

[packages/block/src/block.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L55)

***

### common

> `readonly` **common**: `object`

#### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

##### Index Signature

 \[`key`: `string`\]: `ChainBlockExplorer`

#### blockExplorers.default

> **default**: `ChainBlockExplorer`

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

#### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; \} \| undefined; ... 11...

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; \} \| undefined; ... 11...

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

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

#### rpcUrls.default

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

#### Defined in

[packages/block/src/block.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L45)

***

### executionWitness?

> `readonly` `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Defined in

[packages/block/src/block.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L53)

***

### header

> `readonly` **header**: [`BlockHeader`](BlockHeader.md)

#### Defined in

[packages/block/src/block.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L40)

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[packages/block/src/block.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L46)

***

### requests?

> `readonly` `optional` **requests**: [`ClRequest`](ClRequest.md)[]

#### Defined in

[packages/block/src/block.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L44)

***

### transactions

> `readonly` **transactions**: `TypedTransaction`[] = `[]`

#### Defined in

[packages/block/src/block.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L41)

***

### uncleHeaders

> `readonly` **uncleHeaders**: [`BlockHeader`](BlockHeader.md)[] = `[]`

#### Defined in

[packages/block/src/block.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L42)

***

### withdrawals?

> `readonly` `optional` **withdrawals**: `Withdrawal`[]

#### Defined in

[packages/block/src/block.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L43)

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[packages/block/src/block.ts:801](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L801)

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

• **parentBlock**: [`Block`](Block.md)

the parent of this `Block`

#### Returns

`bigint`

#### Defined in

[packages/block/src/block.ts:735](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L735)

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/block/src/block.ts:455](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L455)

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Defined in

[packages/block/src/block.ts:501](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L501)

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Defined in

[packages/block/src/block.ts:434](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L434)

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

[packages/block/src/block.ts:441](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L441)

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

#### Defined in

[packages/block/src/block.ts:412](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L412)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/block/src/block.ts:478](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L478)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Defined in

[packages/block/src/block.ts:448](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L448)

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Defined in

[packages/block/src/block.ts:767](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L767)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

#### Defined in

[packages/block/src/block.ts:752](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L752)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Defined in

[packages/block/src/block.ts:551](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L551)

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Defined in

[packages/block/src/block.ts:464](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L464)

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Defined in

[packages/block/src/block.ts:668](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L668)

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

#### Defined in

[packages/block/src/block.ts:622](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L622)

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

[packages/block/src/block.ts:567](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L567)

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

#### Defined in

[packages/block/src/block.ts:745](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L745)

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

[packages/block/src/block.ts:711](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L711)

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Defined in

[packages/block/src/block.ts:681](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L681)

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

#### Defined in

[packages/block/src/block.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L325)

***

### fromBlockData()

> `static` **fromBlockData**(`blockData`, `opts`): [`Block`](Block.md)

Static constructor to create a block from a block data dictionary

#### Parameters

• **blockData**: [`BlockData`](../interfaces/BlockData.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`Block`](Block.md)

#### Defined in

[packages/block/src/block.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L109)

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

#### Defined in

[packages/block/src/block.ts:260](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L260)

***

### fromRLPSerializedBlock()

> `static` **fromRLPSerializedBlock**(`serialized`, `opts`): [`Block`](Block.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

• **serialized**: `Uint8Array`

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`Block`](Block.md)

#### Defined in

[packages/block/src/block.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L161)

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`): [`Block`](Block.md)

Static constructor to create a block from an array of Bytes values

#### Parameters

• **values**: [`BlockBytes`](../type-aliases/BlockBytes.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`Block`](Block.md)

#### Defined in

[packages/block/src/block.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L177)

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

#### Defined in

[packages/block/src/block.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L93)

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

#### Defined in

[packages/block/src/block.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L79)

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

#### Defined in

[packages/block/src/block.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L66)
