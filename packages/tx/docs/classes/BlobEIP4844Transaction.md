**@tevm/tx** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BlobEIP4844Transaction

# Class: BlobEIP4844Transaction

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

## Extends

- `BaseTransaction`\<[`BlobEIP4844`](../enumerations/TransactionType.md#blobeip4844)\>

## Constructors

### new BlobEIP4844Transaction(txData, opts)

> **new BlobEIP4844Transaction**(`txData`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static constructors or factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

▪ **txData**: `BlobEIP4844TxData`

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Overrides

BaseTransaction\<TransactionType.BlobEIP4844\>.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:32

## Properties

### AccessListJSON

> **`readonly`** **AccessListJSON**: `AccessList`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:16

***

### \_type

> **`protected`** **`readonly`** **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

BaseTransaction.\_type

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

***

### accessList

> **`readonly`** **accessList**: `AccessListBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:15

***

### activeCapabilities

> **`protected`** **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

BaseTransaction.activeCapabilities

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:21

***

### blobs

> **blobs**?: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:22

***

### cache

> **cache**: `TransactionCache`

#### Inherited from

BaseTransaction.cache

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

***

### chainId

> **`readonly`** **chainId**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:14

***

### common

> **`readonly`** **common**: `Common`

#### Overrides

BaseTransaction.common

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:20

***

### data

> **`readonly`** **data**: `Uint8Array`

#### Inherited from

BaseTransaction.data

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

***

### gasLimit

> **`readonly`** **gasLimit**: `bigint`

#### Inherited from

BaseTransaction.gasLimit

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

***

### kzgCommitments

> **kzgCommitments**?: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:23

***

### kzgProofs

> **kzgProofs**?: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:24

***

### maxFeePerBlobGas

> **`readonly`** **maxFeePerBlobGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:19

***

### maxFeePerGas

> **`readonly`** **maxFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:18

***

### maxPriorityFeePerGas

> **`readonly`** **maxPriorityFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:17

***

### nonce

> **`readonly`** **nonce**: `bigint`

#### Inherited from

BaseTransaction.nonce

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

***

### r

> **`readonly`** **r**?: `bigint`

#### Inherited from

BaseTransaction.r

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

***

### s

> **`readonly`** **s**?: `bigint`

#### Inherited from

BaseTransaction.s

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

***

### to

> **`readonly`** **to**?: `Address`

#### Inherited from

BaseTransaction.to

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

***

### txOptions

> **`protected`** **`readonly`** **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

#### Inherited from

BaseTransaction.txOptions

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

***

### v

> **`readonly`** **v**?: `bigint`

#### Inherited from

BaseTransaction.v

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

***

### value

> **`readonly`** **value**: `bigint`

#### Inherited from

BaseTransaction.value

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

> **`get`** **type**(): [`TransactionType`](../enumerations/TransactionType.md)

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

## Methods

### \_getSharedErrorPostfix()

> **`protected`** **\_getSharedErrorPostfix**(): `string`

Returns the shared error postfix part for _error() method
tx type implementations.

#### Inherited from

BaseTransaction.\_getSharedErrorPostfix

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

***

### \_validateCannotExceedMaxInteger()

> **`protected`** **\_validateCannotExceedMaxInteger**(`values`, `bits`?, `cannotEqual`?): `void`

Validates that an object with BigInt values cannot exceed the specified bit limit.

#### Parameters

▪ **values**: `object`

Object containing string keys and BigInt values

▪ **bits?**: `number`

Number of bits to check (64 or 256)

▪ **cannotEqual?**: `boolean`

Pass true if the number also cannot equal one less the maximum value

#### Inherited from

BaseTransaction.\_validateCannotExceedMaxInteger

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

▪ **v**: `bigint`

▪ **r**: `bigint` \| `Uint8Array`

▪ **s**: `bigint` \| `Uint8Array`

▪ **convertV?**: `boolean`

#### Overrides

BaseTransaction.addSignature

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:139

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Overrides

BaseTransaction.errorStr

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:143

***

### getBaseFee()

> **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Inherited from

BaseTransaction.getBaseFee

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

***

### getDataFee()

> **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Overrides

BaseTransaction.getDataFee

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:71

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

▪ **baseFee**: `bigint`

Base fee retrieved from block

#### Overrides

BaseTransaction.getEffectivePriorityFee

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:38

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Overrides

BaseTransaction.getHashedMessageToSign

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:125

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Overrides

BaseTransaction.getMessageToSign

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:117

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:133

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Returns the sender's address

#### Inherited from

BaseTransaction.getSenderAddress

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Overrides

BaseTransaction.getSenderPublicKey

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:137

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`?): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

▪ **baseFee?**: `bigint`

The base fee of the block (will be set to 0 if not provided)

#### Overrides

BaseTransaction.getUpfrontCost

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:76

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

an array of error strings

#### Inherited from

BaseTransaction.getValidationErrors

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [BlobEIP4844Transaction.getMessageToSign](BlobEIP4844Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Overrides

BaseTransaction.hash

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:132

***

### isSigned()

> **isSigned**(): `boolean`

#### Inherited from

BaseTransaction.isSigned

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:116

***

### isValid()

> **isValid**(): `boolean`

Validates the transaction signature and minimum gas requirements.

#### Returns

true if the transaction is valid, false otherwise

#### Inherited from

BaseTransaction.isValid

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

***

### numBlobs()

> **numBlobs**(): `number`

#### Returns

the number of blobs included with this transaction

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:154

***

### raw()

> **raw**(): `BlobEIP4844TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.

Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.

Use {@link BlobEIP4844Transaction.serialize} to add a transaction to a block
with {@link Block.fromValuesArray}.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [BlobEIP4844Transaction.getMessageToSign](BlobEIP4844Transaction.md#getmessagetosign).

#### Overrides

BaseTransaction.raw

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:90

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-4844 transaction.

Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Overrides

BaseTransaction.serialize

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:101

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

#### Returns

the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:105

***

### sign()

> **sign**(`privateKey`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

▪ **privateKey**: `Uint8Array`

#### Inherited from

BaseTransaction.sign

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:138

***

### supports()

> **supports**(`capability`): `boolean`

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

▪ **capability**: [`Capability`](../enumerations/Capability.md)

#### Inherited from

BaseTransaction.supports

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Inherited from

BaseTransaction.toCreationAddress

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

BaseTransaction.toJSON

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:138

***

### verifySignature()

> **verifySignature**(): `boolean`

Determines if the signature is valid

#### Inherited from

BaseTransaction.verifySignature

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

***

### \_validateNotArray()

> **`static`** **`protected`** **\_validateNotArray**(`values`): `void`

#### Parameters

▪ **values**: `object`

#### Inherited from

BaseTransaction.\_validateNotArray

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

***

### fromSerializedBlobTxNetworkWrapper()

> **`static`** **fromSerializedBlobTxNetworkWrapper**(`serialized`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)

#### Parameters

▪ **serialized**: `Uint8Array`

a buffer representing a serialized BlobTransactionNetworkWrapper

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

any TxOptions defined

#### Returns

a BlobEIP4844Transaction

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:67

***

### fromSerializedTx()

> **`static`** **fromSerializedTx**(`serialized`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`

#### Parameters

▪ **serialized**: `Uint8Array`

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:53

***

### fromTxData()

> **`static`** **fromTxData**(`txData`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

▪ **txData**: `BlobEIP4844TxData`

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:33

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

#### Parameters

▪ **values**: `BlobEIP4844TxValuesArray`

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:60

***

### minimalFromNetworkWrapper()

> **`static`** **minimalFromNetworkWrapper**(`txData`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates the minimal representation of a blob transaction from the network wrapper version.
The minimal representation is used when adding transactions to an execution payload/block

#### Parameters

▪ **txData**: [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

a [BlobEIP4844Transaction](BlobEIP4844Transaction.md) containing optional blobs/kzg commitments

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

dictionary of [TxOptions](../interfaces/TxOptions.md)

#### Returns

the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:46

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
