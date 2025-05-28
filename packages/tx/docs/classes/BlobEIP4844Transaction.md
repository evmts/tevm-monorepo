[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / BlobEIP4844Transaction

# Class: BlobEIP4844Transaction

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:13

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

## Implements

- `TransactionInterface`\<*typeof* [`BlobEIP4844`](../variables/TransactionType.md#blobeip4844)\>

## Constructors

### Constructor

> **new BlobEIP4844Transaction**(`txData`, `opts?`): `Blob4844Tx`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:48

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static constructors or factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

`BlobEIP4844TxData`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`Blob4844Tx`

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:20

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:40

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

***

### blobs?

> `optional` **blobs**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:29

***

### blobVersionedHashes

> **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:25

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:34

#### Implementation of

`TransactionInterface.cache`

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:21

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:32

#### Implementation of

`TransactionInterface.common`

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:18

#### Implementation of

`TransactionInterface.data`

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:16

#### Implementation of

`TransactionInterface.gasLimit`

***

### kzgCommitments?

> `optional` **kzgCommitments**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:30

***

### kzgProofs?

> `optional` **kzgProofs**: `` `0x${string}` ``[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:31

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:24

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:23

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:22

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:15

#### Implementation of

`TransactionInterface.nonce`

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:27

#### Implementation of

`TransactionInterface.r`

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:28

#### Implementation of

`TransactionInterface.s`

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:19

#### Implementation of

`TransactionInterface.to`

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:33

#### Implementation of

`TransactionInterface.txOptions`

***

### type

> **type**: `3`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:14

#### Implementation of

`TransactionInterface.type`

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:26

#### Implementation of

`TransactionInterface.v`

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:17

#### Implementation of

`TransactionInterface.value`

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `Blob4844Tx`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:153

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Blob4844Tx`

#### Implementation of

`TransactionInterface.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:163

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

`TransactionInterface.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:74

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getDataGas`

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:70

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

##### baseFee

`bigint`

Base fee retrieved from block

#### Returns

`bigint`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:139

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:90

The minimum gas limit which the tx to have to be valid.
This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
the optional creation fee (if the transaction creates a contract), and if relevant the gas
to be paid for access lists (EIP-2930) and authority lists (EIP-7702).

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getIntrinsicGas`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:131

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:147

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:157

#### Returns

`Address`

#### Implementation of

`TransactionInterface.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:151

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee?`): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:79

The up front amount that an account must have for this transaction to be valid

#### Parameters

##### baseFee?

`bigint`

The base fee of the block (will be set to 0 if not provided)

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:154

#### Returns

`string`[]

#### Implementation of

`TransactionInterface.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:146

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [Blob4844Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:159

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:155

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.isValid`

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:167

#### Returns

`number`

the number of blobs included with this transaction

***

### raw()

> **raw**(): `BlobEIP4844TxValuesArray`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:104

Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.

Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.

Use [Blob4844Tx.serialize](#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [Blob4844Tx.getMessageToSign](#getmessagetosign).

#### Returns

`BlobEIP4844TxValuesArray`

#### Implementation of

`TransactionInterface.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:115

Returns the serialized encoding of the EIP-4844 transaction.

Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.serialize`

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:119

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `Blob4844Tx`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:158

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Blob4844Tx`

#### Implementation of

`TransactionInterface.sign`

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:65

Checks if a tx type defining capability is active
on a tx, for example the EIP-1559 fee market mechanism
or the EIP-2930 access list feature.

Note that this is different from the tx type itself,
so EIP-2930 access lists can very well be active
on an EIP-1559 tx for example.

This method can be useful for feature checks if the
tx type is unknown (e.g. when instantiated with
the tx factory).

See `Capabilities` in the `types` module for a reference
on all supported capabilities.

#### Parameters

##### capability

`number`

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:83

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:152

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Implementation of

`TransactionInterface.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:156

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.verifySignature`
