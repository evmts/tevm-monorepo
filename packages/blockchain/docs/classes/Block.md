[@tevm/blockchain](../README.md) / [Exports](../modules.md) / Block

# Class: Block

An object that represents the block.

## Table of contents

### Constructors

- [constructor](Block.md#constructor)

### Properties

- [cache](Block.md#cache)
- [common](Block.md#common)
- [header](Block.md#header)
- [transactions](Block.md#transactions)
- [uncleHeaders](Block.md#uncleheaders)
- [withdrawals](Block.md#withdrawals)
- [fromJsonRpcProvider](Block.md#fromjsonrpcprovider)

### Methods

- [errorStr](Block.md#errorstr)
- [ethashCanonicalDifficulty](Block.md#ethashcanonicaldifficulty)
- [genTxTrie](Block.md#gentxtrie)
- [getTransactionsValidationErrors](Block.md#gettransactionsvalidationerrors)
- [hash](Block.md#hash)
- [isGenesis](Block.md#isgenesis)
- [raw](Block.md#raw)
- [serialize](Block.md#serialize)
- [toJSON](Block.md#tojson)
- [transactionsAreValid](Block.md#transactionsarevalid)
- [transactionsTrieIsValid](Block.md#transactionstrieisvalid)
- [uncleHashIsValid](Block.md#unclehashisvalid)
- [validateBlobTransactions](Block.md#validateblobtransactions)
- [validateData](Block.md#validatedata)
- [validateGasLimit](Block.md#validategaslimit)
- [validateUncles](Block.md#validateuncles)
- [withdrawalsTrieIsValid](Block.md#withdrawalstrieisvalid)
- [fromBeaconPayloadJson](Block.md#frombeaconpayloadjson)
- [fromBlockData](Block.md#fromblockdata)
- [fromExecutionPayload](Block.md#fromexecutionpayload)
- [fromRLPSerializedBlock](Block.md#fromrlpserializedblock)
- [fromRPC](Block.md#fromrpc)
- [fromValuesArray](Block.md#fromvaluesarray)
- [genTransactionsTrieRoot](Block.md#gentransactionstrieroot)
- [genWithdrawalsTrieRoot](Block.md#genwithdrawalstrieroot)

## Constructors

### constructor

• **new Block**(`header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `opts?`): [`Block`](Block.md)

This constructor takes the values, validates them, assigns them and freezes the object.
Use the static factory methods to assist in creating a Block object from varying data types and options.

#### Parameters

| Name | Type |
| :------ | :------ |
| `header?` | `BlockHeader` |
| `transactions?` | `TypedTransaction`[] |
| `uncleHeaders?` | `BlockHeader`[] |
| `withdrawals?` | `Withdrawal`[] |
| `opts?` | `BlockOptions` |

#### Returns

[`Block`](Block.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:86

## Properties

### cache

• `Private` **cache**: `any`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:18

___

### common

• `Readonly` **common**: `Common`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:17

___

### header

• `Readonly` **header**: `BlockHeader`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:13

___

### transactions

• `Readonly` **transactions**: `TypedTransaction`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:14

___

### uncleHeaders

• `Readonly` **uncleHeaders**: `BlockHeader`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:15

___

### withdrawals

• `Optional` `Readonly` **withdrawals**: `Withdrawal`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:16

___

### fromJsonRpcProvider

▪ `Static` **fromJsonRpcProvider**: (`provider`: `string` \| `EthersProvider`, `blockTag`: `string` \| `bigint`, `opts`: `BlockOptions`) => `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from a JSON-RPC provider and format as a [Block](Block.md)

**`Param`**

either a url for a remote provider or an Ethers JsonRpcProvider object

**`Param`**

block hash or block number to be run

**`Param`**

BlockOptions

#### Type declaration

▸ (`provider`, `blockTag`, `opts`): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from a JSON-RPC provider and format as a [Block](Block.md)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `string` \| `EthersProvider` | either a url for a remote provider or an Ethers JsonRpcProvider object |
| `blockTag` | `string` \| `bigint` | block hash or block number to be run |
| `opts` | `BlockOptions` | BlockOptions |

##### Returns

`Promise`\<[`Block`](Block.md)\>

the block specified by `blockTag`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:67

## Methods

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:180

___

### ethashCanonicalDifficulty

▸ **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:165

___

### genTxTrie

▸ **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:106

___

### getTransactionsValidationErrors

▸ **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:117

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:94

___

### isGenesis

▸ **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:98

___

### raw

▸ **raw**(): `BlockBytes`

Returns a Array of the raw Bytes Arays of this block, in order.

#### Returns

`BlockBytes`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:90

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:102

___

### toJSON

▸ **toJSON**(): `JsonBlock`

Returns the block in JSON format.

#### Returns

`JsonBlock`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:176

___

### transactionsAreValid

▸ **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:122

___

### transactionsTrieIsValid

▸ **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:112

___

### uncleHashIsValid

▸ **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:144

___

### validateBlobTransactions

▸ **validateBlobTransactions**(`parentHeader`): `void`

Validates that blob gas fee for each transaction is greater than or equal to the
blobGasPrice for the block and that total blob gas in block is less than maximum
blob gas per block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentHeader` | `BlockHeader` | header of parent block |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:139

___

### validateData

▸ **validateData**(`onlyHeader?`): `Promise`\<`void`\>

Validates the block data, throwing if invalid.
This can be checked on the Block itself without needing access to any parent block
It checks:
- All transactions are valid
- The transactions trie is valid
- The uncle hash is valid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onlyHeader?` | `boolean` | if only passed the header, skip validating txTrie and unclesHash (default: false) |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:132

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | [`Block`](Block.md) | the parent of this `Block` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:172

___

### validateUncles

▸ **validateUncles**(): `void`

Consistency checks for uncles included in the block, if any.

Throws if invalid.

The rules for uncles checked are the following:
Header has at most 2 uncles.
Header does not count an uncle twice.

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:159

___

### withdrawalsTrieIsValid

▸ **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:149

___

### fromBeaconPayloadJson

▸ **fromBeaconPayloadJson**(`payload`, `options?`): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from a beacon payload json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `BeaconPayloadJson` | json of a beacon beacon fetched from beacon apis |
| `options?` | `BlockOptions` | - |

#### Returns

`Promise`\<[`Block`](Block.md)\>

the block constructed block

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:81

___

### fromBlockData

▸ **fromBlockData**(`blockData?`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from a block data dictionary

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockData?` | `BlockData` |
| `opts?` | `BlockOptions` |

#### Returns

[`Block`](Block.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:37

___

### fromExecutionPayload

▸ **fromExecutionPayload**(`payload`, `options?`): `Promise`\<[`Block`](Block.md)\>

Method to retrieve a block from an execution payload

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `ExecutionPayload` |
| `options?` | `BlockOptions` |

#### Returns

`Promise`\<[`Block`](Block.md)\>

the block constructed block

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:74

___

### fromRLPSerializedBlock

▸ **fromRLPSerializedBlock**(`serialized`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from a RLP-serialized block

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts?` | `BlockOptions` |

#### Returns

[`Block`](Block.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:44

___

### fromRPC

▸ **fromRPC**(`blockData`, `uncles?`, `opts?`): [`Block`](Block.md)

Creates a new block object from Ethereum JSON RPC.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockData` | `JsonRpcBlock` | - |
| `uncles?` | `any`[] | Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex) |
| `opts?` | `BlockOptions` | - |

#### Returns

[`Block`](Block.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:59

___

### fromValuesArray

▸ **fromValuesArray**(`values`, `opts?`): [`Block`](Block.md)

Static constructor to create a block from an array of Bytes values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `BlockBytes` |
| `opts?` | `BlockOptions` |

#### Returns

[`Block`](Block.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:51

___

### genTransactionsTrieRoot

▸ **genTransactionsTrieRoot**(`txs`, `emptyTrie?`): `Promise`\<`Uint8Array`\>

Returns the txs trie root for array of TypedTransaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txs` | `TypedTransaction`[] | array of TypedTransaction to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:30

___

### genWithdrawalsTrieRoot

▸ **genWithdrawalsTrieRoot**(`wts`, `emptyTrie?`): `Promise`\<`Uint8Array`\>

Returns the withdrawals trie root for array of Withdrawal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wts` | `Withdrawal`[] | array of Withdrawal to compute the root of |
| `emptyTrie?` | `Trie` | - |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.0.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:24
