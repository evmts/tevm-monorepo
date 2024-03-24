[@tevm/blockchain](../README.md) / [Exports](../modules.md) / TevmBlock

# Class: TevmBlock

## Hierarchy

- `Block`

  ↳ **`TevmBlock`**

## Table of contents

### Constructors

- [constructor](TevmBlock.md#constructor)

### Properties

- [cache](TevmBlock.md#cache)
- [common](TevmBlock.md#common)
- [executionWitness](TevmBlock.md#executionwitness)
- [header](TevmBlock.md#header)
- [keccakFunction](TevmBlock.md#keccakfunction)
- [transactions](TevmBlock.md#transactions)
- [uncleHeaders](TevmBlock.md#uncleheaders)
- [withdrawals](TevmBlock.md#withdrawals)
- [fromJsonRpcProvider](TevmBlock.md#fromjsonrpcprovider)

### Methods

- [errorStr](TevmBlock.md#errorstr)
- [ethashCanonicalDifficulty](TevmBlock.md#ethashcanonicaldifficulty)
- [genTxTrie](TevmBlock.md#gentxtrie)
- [getTransactionsValidationErrors](TevmBlock.md#gettransactionsvalidationerrors)
- [hash](TevmBlock.md#hash)
- [isGenesis](TevmBlock.md#isgenesis)
- [raw](TevmBlock.md#raw)
- [serialize](TevmBlock.md#serialize)
- [toJSON](TevmBlock.md#tojson)
- [transactionsAreValid](TevmBlock.md#transactionsarevalid)
- [transactionsTrieIsValid](TevmBlock.md#transactionstrieisvalid)
- [uncleHashIsValid](TevmBlock.md#unclehashisvalid)
- [validateBlobTransactions](TevmBlock.md#validateblobtransactions)
- [validateData](TevmBlock.md#validatedata)
- [validateGasLimit](TevmBlock.md#validategaslimit)
- [validateUncles](TevmBlock.md#validateuncles)
- [withdrawalsTrieIsValid](TevmBlock.md#withdrawalstrieisvalid)
- [fromBeaconPayloadJson](TevmBlock.md#frombeaconpayloadjson)
- [fromBlockData](TevmBlock.md#fromblockdata)
- [fromExecutionPayload](TevmBlock.md#fromexecutionpayload)
- [fromRLPSerializedBlock](TevmBlock.md#fromrlpserializedblock)
- [fromRPC](TevmBlock.md#fromrpc)
- [fromValuesArray](TevmBlock.md#fromvaluesarray)
- [genTransactionsTrieRoot](TevmBlock.md#gentransactionstrieroot)
- [genWithdrawalsTrieRoot](TevmBlock.md#genwithdrawalstrieroot)

## Constructors

### constructor

• **new TevmBlock**(`header?`, `transactions?`, `uncleHeaders?`, `withdrawals?`, `opts?`, `executionWitness?`): [`TevmBlock`](TevmBlock.md)

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
| `executionWitness?` | ``null`` \| `VerkleExecutionWitness` |

#### Returns

[`TevmBlock`](TevmBlock.md)

#### Inherited from

Block.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:95

## Properties

### cache

• `Protected` **cache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `txTrieRoot?` | `Uint8Array` |

#### Inherited from

Block.cache

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:25

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

Block.common

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:17

___

### executionWitness

• `Optional` `Readonly` **executionWitness**: ``null`` \| `VerkleExecutionWitness`

EIP-6800: Verkle Proof Data (experimental)
null implies that the non default executionWitness might exist but not available
and will not lead to execution of the block via vm with verkle stateless manager

#### Inherited from

Block.executionWitness

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:24

___

### header

• `Readonly` **header**: `BlockHeader`

#### Inherited from

Block.header

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:13

___

### keccakFunction

• `Protected` **keccakFunction**: (`msg`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`msg`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Inherited from

Block.keccakFunction

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:18

___

### transactions

• `Readonly` **transactions**: `TypedTransaction`[]

#### Inherited from

Block.transactions

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:14

___

### uncleHeaders

• `Readonly` **uncleHeaders**: `BlockHeader`[]

#### Inherited from

Block.uncleHeaders

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:15

___

### withdrawals

• `Optional` `Readonly` **withdrawals**: `Withdrawal`[]

#### Inherited from

Block.withdrawals

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:16

___

### fromJsonRpcProvider

▪ `Static` **fromJsonRpcProvider**: (`provider`: `string` \| `EthersProvider`, `blockTag`: `string` \| `bigint`, `opts`: `BlockOptions`) => `Promise`\<`Block`\>

Method to retrieve a block from a JSON-RPC provider and format as a Block

**`Param`**

either a url for a remote provider or an Ethers JsonRpcProvider object

**`Param`**

block hash or block number to be run

**`Param`**

BlockOptions

#### Type declaration

▸ (`provider`, `blockTag`, `opts`): `Promise`\<`Block`\>

Method to retrieve a block from a JSON-RPC provider and format as a Block

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `string` \| `EthersProvider` | either a url for a remote provider or an Ethers JsonRpcProvider object |
| `blockTag` | `string` \| `bigint` | block hash or block number to be run |
| `opts` | `BlockOptions` | BlockOptions |

##### Returns

`Promise`\<`Block`\>

the block specified by `blockTag`

#### Inherited from

Block.fromJsonRpcProvider

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:76

## Methods

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Inherited from

Block.errorStr

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:190

___

### ethashCanonicalDifficulty

▸ **ethashCanonicalDifficulty**(`parentBlock`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | `Block` | the parent of this `Block` |

#### Returns

`bigint`

#### Inherited from

Block.ethashCanonicalDifficulty

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:175

___

### genTxTrie

▸ **genTxTrie**(): `Promise`\<`Uint8Array`\>

Generates transaction trie for validation.

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

Block.genTxTrie

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:115

___

### getTransactionsValidationErrors

▸ **getTransactionsValidationErrors**(): `string`[]

Validates transaction signatures and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

Block.getTransactionsValidationErrors

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:126

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block.

#### Returns

`Uint8Array`

#### Inherited from

Block.hash

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:103

___

### isGenesis

▸ **isGenesis**(): `boolean`

Determines if this block is the genesis block.

#### Returns

`boolean`

#### Inherited from

Block.isGenesis

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:107

___

### raw

▸ **raw**(): `BlockBytes`

Returns a Array of the raw Bytes Arrays of this block, in order.

#### Returns

`BlockBytes`

#### Inherited from

Block.raw

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:99

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block.

#### Returns

`Uint8Array`

#### Inherited from

Block.serialize

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:111

___

### toJSON

▸ **toJSON**(): `JsonBlock`

Returns the block in JSON format.

#### Returns

`JsonBlock`

#### Inherited from

Block.toJSON

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:186

___

### transactionsAreValid

▸ **transactionsAreValid**(): `boolean`

Validates transaction signatures and minimum gas requirements.

#### Returns

`boolean`

True if all transactions are valid, false otherwise

#### Inherited from

Block.transactionsAreValid

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:131

___

### transactionsTrieIsValid

▸ **transactionsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the transaction trie by generating a trie
and do a check on the root hash.

#### Returns

`Promise`\<`boolean`\>

True if the transaction trie is valid, false otherwise

#### Inherited from

Block.transactionsTrieIsValid

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:121

___

### uncleHashIsValid

▸ **uncleHashIsValid**(): `boolean`

Validates the uncle's hash.

#### Returns

`boolean`

true if the uncle's hash is valid, false otherwise.

#### Inherited from

Block.uncleHashIsValid

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:154

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

#### Inherited from

Block.validateBlobTransactions

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:149

___

### validateData

▸ **validateData**(`onlyHeader?`, `verifyTxs?`): `Promise`\<`void`\>

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
| `verifyTxs?` | `boolean` | if set to `false`, will not check for transaction validation errors (default: true) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Block.validateData

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:142

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlock`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if invalid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlock` | `Block` | the parent of this `Block` |

#### Returns

`void`

#### Inherited from

Block.validateGasLimit

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:182

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

#### Inherited from

Block.validateUncles

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:169

___

### withdrawalsTrieIsValid

▸ **withdrawalsTrieIsValid**(): `Promise`\<`boolean`\>

Validates the withdrawal root

#### Returns

`Promise`\<`boolean`\>

true if the withdrawals trie root is valid, false otherwise

#### Inherited from

Block.withdrawalsTrieIsValid

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:159

___

### fromBeaconPayloadJson

▸ **fromBeaconPayloadJson**(`payload`, `opts?`): `Promise`\<`Block`\>

Method to retrieve a block from a beacon payload json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `BeaconPayloadJson` | json of a beacon beacon fetched from beacon apis |
| `opts?` | `BlockOptions` | BlockOptions |

#### Returns

`Promise`\<`Block`\>

the block constructed block

#### Inherited from

Block.fromBeaconPayloadJson

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:90

___

### fromBlockData

▸ **fromBlockData**(`blockData?`, `opts?`): `Block`

Static constructor to create a block from a block data dictionary

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockData?` | `BlockData` |
| `opts?` | `BlockOptions` |

#### Returns

`Block`

#### Inherited from

Block.fromBlockData

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:46

___

### fromExecutionPayload

▸ **fromExecutionPayload**(`payload`, `opts?`): `Promise`\<`Block`\>

Method to retrieve a block from an execution payload

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `ExecutionPayload` | - |
| `opts?` | `BlockOptions` | BlockOptions |

#### Returns

`Promise`\<`Block`\>

the block constructed block

#### Inherited from

Block.fromExecutionPayload

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:83

___

### fromRLPSerializedBlock

▸ **fromRLPSerializedBlock**(`serialized`, `opts?`): `Block`

Static constructor to create a block from a RLP-serialized block

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts?` | `BlockOptions` |

#### Returns

`Block`

#### Inherited from

Block.fromRLPSerializedBlock

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:53

___

### fromRPC

▸ **fromRPC**(`blockData`, `uncles?`, `opts?`): `Block`

Creates a new block object from Ethereum JSON RPC.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockData` | `JsonRpcBlock` | - |
| `uncles?` | `any`[] | Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex) |
| `opts?` | `BlockOptions` | An object describing the blockchain |

#### Returns

`Block`

#### Inherited from

Block.fromRPC

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:68

___

### fromValuesArray

▸ **fromValuesArray**(`values`, `opts?`): `Block`

Static constructor to create a block from an array of Bytes values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `BlockBytes` |
| `opts?` | `BlockOptions` |

#### Returns

`Block`

#### Inherited from

Block.fromValuesArray

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:60

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

#### Inherited from

Block.genTransactionsTrieRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:39

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

#### Inherited from

Block.genWithdrawalsTrieRoot

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.1.1/node_modules/@ethereumjs/block/dist/esm/block.d.ts:33
