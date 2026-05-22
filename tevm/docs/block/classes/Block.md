[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / Block

# Class: Block

An object that represents the block.

## Constructors

### Constructor

> **new Block**(`opts`, `header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `requests?`, `executionWitness?`): `Block`

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |
| `header?` | [`BlockHeader`](BlockHeader.md) |
| `transactions?` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[] |
| `uncleHeaders?` | [`BlockHeader`](BlockHeader.md)[] |
| `withdrawals?` | [`Withdrawal`](../../utils/classes/Withdrawal.md)[] |
| `requests?` | [`ClRequest`](ClRequest.md)[] |
| `executionWitness?` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null` |

#### Returns

`Block`

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="cache"></a> `cache` | `protected` | `object` | - |
| `cache.requestsRoot?` | `public` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| `cache.txTrieRoot?` | `public` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| `cache.withdrawalsTrieRoot?` | `public` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| <a id="common"></a> `common` | `readonly` | `object` | - |
| `common.blockExplorers?` | `public` | `object` | Collection of block explorers |
| `common.blockExplorers.default` | `public` | `ChainBlockExplorer` | - |
| `common.blockTime?` | `public` | `number` | Block time in milliseconds. |
| `common.contracts?` | `public` | `object` | Collection of contracts |
| `common.contracts.ensRegistry?` | `public` | `ChainContract` | - |
| `common.contracts.ensUniversalResolver?` | `public` | `ChainContract` | - |
| `common.contracts.erc6492Verifier?` | `public` | `ChainContract` | - |
| `common.contracts.multicall3?` | `public` | `ChainContract` | - |
| `common.copy` | `public` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | - |
| `common.custom?` | `public` | `Record`\<`string`, `unknown`\> | Custom chain data. **Deprecated** use `.extend` instead. |
| `common.ensTlds?` | `public` | readonly `string`[] | Collection of ENS TLDs for the chain. |
| `common.ethjsCommon` | `public` | `Common` | - |
| `common.experimental_preconfirmationTime?` | `public` | `number` | Preconfirmation time in milliseconds. |
| `common.extendSchema?` | `public` | `Record`\<`string`, `unknown`\> | Extend schema. |
| `common.fees?` | `public` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | Modifies how fees are derived. |
| `common.formatters?` | `public` | `ChainFormatters` | Modifies how data is formatted and typed (e.g. blocks and transactions) |
| `common.id` | `public` | `number` | ID in number form |
| `common.name` | `public` | `string` | Human-readable name |
| `common.nativeCurrency` | `public` | `ChainNativeCurrency` | Currency used by chain |
| `common.prepareTransactionRequest?` | `public` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | Function to prepare a transaction request. Runs before the transaction is filled. |
| `common.rpcUrls` | `public` | `object` | Collection of RPC endpoints |
| `common.rpcUrls.default` | `public` | `ChainRpcUrls` | - |
| `common.serializers?` | `public` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). |
| `common.sourceId?` | `public` | `number` | Source Chain ID (ie. the L1 chain) |
| `common.testnet?` | `public` | `boolean` | Flag for test networks |
| `common.verifyHash?` | `public` | `ChainVerifyHashFn` | Chain-specific signature verification. |
| <a id="executionwitness"></a> `executionWitness?` | `readonly` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null` | EIP-6800: Verkle Proof Data (experimental) null implies that the non default executionWitness might exist but not available and will not lead to execution of the block via VM Verkle state-witness support. Tevm intentionally does not support Verkle/EIP-6800 execution. |
| <a id="header"></a> `header` | `readonly` | [`BlockHeader`](BlockHeader.md) | - |
| <a id="keccakfunction"></a> `keccakFunction` | `protected` | (`msg`) => `Uint8Array` | - |
| <a id="requests"></a> `requests?` | `readonly` | [`ClRequest`](ClRequest.md)[] | - |
| <a id="transactions"></a> `transactions` | `readonly` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[] | - |
| <a id="uncleheaders"></a> `uncleHeaders` | `readonly` | [`BlockHeader`](BlockHeader.md)[] | - |
| <a id="withdrawals"></a> `withdrawals?` | `readonly` | [`Withdrawal`](../../utils/classes/Withdrawal.md)[] | - |

## Methods

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentBlock` | `Block` | the parent of this `Block` |

#### Returns

`bigint`

***

### genTxTrie()

> **genTxTrie**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentHeader` | [`BlockHeader`](BlockHeader.md) | header of parent block |

#### Returns

`void`

***

### validateData()

> **validateData**(`onlyHeader?`, `verifyTxs?`): `Promise`\<`void`\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onlyHeader?` | `boolean` | if only passed the header, skip validating txTrie and unclesHash (default: false) |
| `verifyTxs?` | `boolean` | if set to `false`, will not check for transaction validation errors (default: true) |

#### Returns

`Promise`\<`void`\>

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentBlock` | `Block` | the parent of this `Block` |

#### Returns

`void`

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

***

### withdrawalsTrieIsValid()

> **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

***

### computeRequestsHash()

> `static` **computeRequestsHash**(`requests`): `Uint8Array`\<`ArrayBuffer`\>

Returns the EIP-7685 requests hash for an array of CLRequests.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `requests` | [`ClRequest`](ClRequest.md)[] | an array of CLRequests |

#### Returns

`Uint8Array`\<`ArrayBuffer`\>

a 32 byte Uint8Array representing the requests hash

***

### fromBeaconPayloadJson()

> `static` **fromBeaconPayloadJson**(`payload`, `opts`): `Promise`\<`Block`\>

Method to retrieve a block from a beacon payload json

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`BeaconPayloadJson`](../type-aliases/BeaconPayloadJson.md) | json of a beacon beacon fetched from beacon apis |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | [BlockOptions](../interfaces/BlockOptions.md) |

#### Returns

`Promise`\<`Block`\>

the block constructed block

***

### ~~fromBlockData()~~

> `static` **fromBlockData**(`blockData`, `opts`): `Block`

Static constructor to create a block from a block data dictionary

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blockData` | [`BlockData`](../interfaces/BlockData.md) | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`Block`

#### Deprecated

Use createBlock() instead - this method is kept for compatibility

***

### fromExecutionPayload()

> `static` **fromExecutionPayload**(`payload`, `opts`): `Promise`\<`Block`\>

Method to retrieve a block from an execution payload

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`ExecutionPayload`](../type-aliases/ExecutionPayload.md) | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | [BlockOptions](../interfaces/BlockOptions.md) |

#### Returns

`Promise`\<`Block`\>

the block constructed block

***

### ~~fromRLPSerializedBlock()~~

> `static` **fromRLPSerializedBlock**(`serialized`, `opts`): `Block`

Static constructor to create a block from a RLP-serialized block

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serialized` | `Uint8Array` | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`Block`

#### Deprecated

Use createBlockFromRLP() instead - this method is kept for compatibility

***

### ~~fromValuesArray()~~

> `static` **fromValuesArray**(`values`, `opts`): `Block`

Static constructor to create a block from an array of Bytes values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | [`BlockBytes`](../type-aliases/BlockBytes.md) | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`Block`

#### Deprecated

Use createBlockFromValuesArray() instead - this method is kept for compatibility

***

### genRequestsTrieRoot()

> `static` **genRequestsTrieRoot**(`requests`, `_emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `requests` | [`ClRequest`](ClRequest.md)[] |
| `_emptyTrie?` | `Trie` |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

***

### genTransactionsTrieRoot()

> `static` **genTransactionsTrieRoot**(`txs`, `emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `txs` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[] | array of TypedTransaction to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### genWithdrawalsTrieRoot()

> `static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `wts` | [`Withdrawal`](../../utils/classes/Withdrawal.md)[] | array of Withdrawal to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
