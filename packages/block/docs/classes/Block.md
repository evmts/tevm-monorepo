[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / Block

# Class: Block

Defined in: [packages/block/src/block.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L155)

An object that represents the block.

## Constructors

### Constructor

> **new Block**(`opts`, `header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `requests?`, `executionWitness?`): `Block`

Defined in: [packages/block/src/block.ts:472](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L472)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | `undefined` |
| `header?` | [`BlockHeader`](BlockHeader.md) | `undefined` |
| `transactions?` | `TypedTransaction`[] | `[]` |
| `uncleHeaders?` | [`BlockHeader`](BlockHeader.md)[] | `[]` |
| `withdrawals?` | `Withdrawal`[] | `undefined` |
| `requests?` | [`ClRequest`](ClRequest.md)[] | `undefined` |
| `executionWitness?` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null` | `undefined` |

#### Returns

`Block`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cache"></a> `cache` | `protected` | `object` | `{}` | - | [packages/block/src/block.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L172) |
| `cache.requestsRoot?` | `public` | `Uint8Array`\<`ArrayBufferLike`\> | `undefined` | - | [packages/block/src/block.ts:175](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L175) |
| `cache.txTrieRoot?` | `public` | `Uint8Array`\<`ArrayBufferLike`\> | `undefined` | - | [packages/block/src/block.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L173) |
| `cache.withdrawalsTrieRoot?` | `public` | `Uint8Array`\<`ArrayBufferLike`\> | `undefined` | - | [packages/block/src/block.ts:174](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L174) |
| <a id="common"></a> `common` | `readonly` | `object` | `undefined` | - | [packages/block/src/block.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L161) |
| `common.blockExplorers?` | `public` | `object` | `undefined` | Collection of block explorers | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:15 |
| `common.blockExplorers.default` | `public` | `ChainBlockExplorer` | `undefined` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:17 |
| `common.blockTime?` | `public` | `number` | `undefined` | Block time in milliseconds. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:20 |
| `common.contracts?` | `public` | `object` | `undefined` | Collection of contracts | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:22 |
| `common.contracts.ensRegistry?` | `public` | `ChainContract` | `undefined` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:27 |
| `common.contracts.ensUniversalResolver?` | `public` | `ChainContract` | `undefined` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:28 |
| `common.contracts.erc6492Verifier?` | `public` | `ChainContract` | `undefined` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:30 |
| `common.contracts.multicall3?` | `public` | `ChainContract` | `undefined` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:29 |
| `common.copy` | `public` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | `undefined` | - | packages/common/types/Common.d.ts:28 |
| `common.custom?` | `public` | `Record`\<`string`, `unknown`\> | `undefined` | Custom chain data. **Deprecated** use `.extend` instead. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:59 |
| `common.ensTlds?` | `public` | readonly `string`[] | `undefined` | Collection of ENS TLDs for the chain. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:33 |
| `common.ethjsCommon` | `public` | `Common` | `undefined` | - | packages/common/types/Common.d.ts:27 |
| `common.experimental_preconfirmationTime?` | `public` | `number` | `undefined` | Preconfirmation time in milliseconds. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:41 |
| `common.extendSchema?` | `public` | `Record`\<`string`, `unknown`\> | `undefined` | Extend schema. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:61 |
| `common.fees?` | `public` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | `undefined` | Modifies how fees are derived. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:63 |
| `common.formatters?` | `public` | `ChainFormatters` | `undefined` | Modifies how data is formatted and typed (e.g. blocks and transactions) | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:65 |
| `common.id` | `public` | `number` | `undefined` | ID in number form | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:35 |
| `common.name` | `public` | `string` | `undefined` | Human-readable name | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:37 |
| `common.nativeCurrency` | `public` | `ChainNativeCurrency` | `undefined` | Currency used by chain | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:39 |
| `common.prepareTransactionRequest?` | `public` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | `undefined` | Function to prepare a transaction request. Runs before the transaction is filled. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:67 |
| `common.rpcUrls` | `public` | `object` | `undefined` | Collection of RPC endpoints | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:43 |
| `common.rpcUrls.default` | `public` | `ChainRpcUrls` | `undefined` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:45 |
| `common.serializers?` | `public` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | `undefined` | Modifies how data is serialized (e.g. transactions). | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:81 |
| `common.sourceId?` | `public` | `number` | `undefined` | Source Chain ID (ie. the L1 chain) | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:48 |
| `common.testnet?` | `public` | `boolean` | `undefined` | Flag for test networks | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:50 |
| `common.verifyHash?` | `public` | `ChainVerifyHashFn` | `undefined` | Chain-specific signature verification. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:83 |
| <a id="executionwitness"></a> `executionWitness?` | `readonly` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) \| `null` | `undefined` | EIP-6800: Verkle Proof Data (experimental) null implies that the non default executionWitness might exist but not available and will not lead to execution of the block via VM Verkle state-witness support. Tevm intentionally does not support Verkle/EIP-6800 execution. | [packages/block/src/block.ts:170](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L170) |
| <a id="header"></a> `header` | `readonly` | [`BlockHeader`](BlockHeader.md) | `undefined` | - | [packages/block/src/block.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L156) |
| <a id="keccakfunction"></a> `keccakFunction` | `protected` | (`msg`) => `Uint8Array` | `undefined` | - | [packages/block/src/block.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L162) |
| <a id="requests"></a> `requests?` | `readonly` | [`ClRequest`](ClRequest.md)[] | `undefined` | - | [packages/block/src/block.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L160) |
| <a id="transactions"></a> `transactions` | `readonly` | `TypedTransaction`[] | `[]` | - | [packages/block/src/block.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L157) |
| <a id="uncleheaders"></a> `uncleHeaders` | `readonly` | [`BlockHeader`](BlockHeader.md)[] | `[]` | - | [packages/block/src/block.ts:158](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L158) |
| <a id="withdrawals"></a> `withdrawals?` | `readonly` | `Withdrawal`[] | `undefined` | - | [packages/block/src/block.ts:159](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L159) |

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: [packages/block/src/block.ts:948](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L948)

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Defined in: [packages/block/src/block.ts:881](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L881)

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

Defined in: [packages/block/src/block.ts:596](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L596)

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getTransactionsValidationErrors()

> **getTransactionsValidationErrors**(): `string`[]

Defined in: [packages/block/src/block.ts:642](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L642)

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [packages/block/src/block.ts:575](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L575)

Returns the hash of the block.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Defined in: [packages/block/src/block.ts:582](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L582)

Determines if this block is the genesis block.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockBytes`](../type-aliases/BlockBytes.md)

Defined in: [packages/block/src/block.ts:550](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L550)

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

[`BlockBytes`](../type-aliases/BlockBytes.md)

***

### requestsTrieIsValid()

> **requestsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: [packages/block/src/block.ts:619](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L619)

#### Returns

`Promise`\<`boolean`\>

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/block/src/block.ts:589](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L589)

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

***

### toExecutionPayload()

> **toExecutionPayload**(): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Defined in: [packages/block/src/block.ts:913](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L913)

#### Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

***

### toJSON()

> **toJSON**(): [`JsonBlock`](../interfaces/JsonBlock.md)

Defined in: [packages/block/src/block.ts:898](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L898)

Returns the block in JSON format.

#### Returns

[`JsonBlock`](../interfaces/JsonBlock.md)

***

### transactionsAreValid()

> **transactionsAreValid**(): `boolean`

Defined in: [packages/block/src/block.ts:692](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L692)

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

***

### transactionsTrieIsValid()

> **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Defined in: [packages/block/src/block.ts:605](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L605)

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

***

### uncleHashIsValid()

> **uncleHashIsValid**(): `boolean`

Defined in: [packages/block/src/block.ts:814](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L814)

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

***

### validateBlobTransactions()

> **validateBlobTransactions**(`parentHeader`): `void`

Defined in: [packages/block/src/block.ts:768](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L768)

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

Defined in: [packages/block/src/block.ts:708](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L708)

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `onlyHeader` | `boolean` | `false` | if only passed the header, skip validating txTrie and unclesHash (default: false) |
| `verifyTxs` | `boolean` | `true` | if set to `false`, will not check for transaction validation errors (default: true) |

#### Returns

`Promise`\<`void`\>

***

### validateGasLimit()

> **validateGasLimit**(`parentBlock`): `void`

Defined in: [packages/block/src/block.ts:891](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L891)

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

Defined in: [packages/block/src/block.ts:857](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L857)

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

Defined in: [packages/block/src/block.ts:827](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L827)

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

***

### computeRequestsHash()

> `static` **computeRequestsHash**(`requests`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/block/src/block.ts:209](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L209)

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

Defined in: [packages/block/src/block.ts:463](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L463)

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

Defined in: [packages/block/src/block.ts:237](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L237)

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

Defined in: [packages/block/src/block.ts:398](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L398)

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

Defined in: [packages/block/src/block.ts:295](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L295)

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

Defined in: [packages/block/src/block.ts:312](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L312)

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

Defined in: [packages/block/src/block.ts:226](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L226)

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

Defined in: [packages/block/src/block.ts:196](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L196)

Returns the txs trie root for array of TypedTransaction

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `txs` | `TypedTransaction`[] | array of TypedTransaction to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### genWithdrawalsTrieRoot()

> `static` **genWithdrawalsTrieRoot**(`wts`, `emptyTrie?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/block/src/block.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/block.ts#L183)

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `wts` | `Withdrawal`[] | array of Withdrawal to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
