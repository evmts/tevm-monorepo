[**@tevm/tx**](../README.md) • **Docs**

***

[@tevm/tx](../globals.md) / BlobEIP4844Transaction

# Class: BlobEIP4844Transaction

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

## Extends

- `BaseTransaction`\<[`BlobEIP4844`](../enumerations/TransactionType.md#blobeip4844)\>

## Constructors

### new BlobEIP4844Transaction()

> **new BlobEIP4844Transaction**(`txData`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static constructors or factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

• **txData**: `BlobEIP4844TxData`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Overrides

`BaseTransaction<TransactionType.BlobEIP4844>.constructor`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:32

## Properties

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:16

***

### \_type

> `protected` `readonly` **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

`BaseTransaction._type`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:15

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

`BaseTransaction.activeCapabilities`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:21

***

### blobs?

> `optional` **blobs**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:22

***

### cache

> **cache**: `TransactionCache`

#### Inherited from

`BaseTransaction.cache`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

***

### chainId

> `readonly` **chainId**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:14

***

### common

> `readonly` **common**: `Common`

#### Overrides

`BaseTransaction.common`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:20

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

`BaseTransaction.data`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

`BaseTransaction.gasLimit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

***

### kzgCommitments?

> `optional` **kzgCommitments**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:23

***

### kzgProofs?

> `optional` **kzgProofs**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:24

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:19

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:18

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:17

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

`BaseTransaction.nonce`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

***

### r?

> `readonly` `optional` **r**: `bigint`

#### Inherited from

`BaseTransaction.r`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

***

### s?

> `readonly` `optional` **s**: `bigint`

#### Inherited from

`BaseTransaction.s`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

***

### to?

> `readonly` `optional` **to**: `Address`

#### Inherited from

`BaseTransaction.to`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

***

### txOptions

> `protected` `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

#### Inherited from

`BaseTransaction.txOptions`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

***

### v?

> `readonly` `optional` **v**: `bigint`

#### Inherited from

`BaseTransaction.v`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

`BaseTransaction.value`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

> `get` **type**(): [`TransactionType`](../enumerations/TransactionType.md)

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

[`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

`BaseTransaction.type`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

## Methods

### \_getSharedErrorPostfix()

> `protected` **\_getSharedErrorPostfix**(): `string`

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

`BaseTransaction._getSharedErrorPostfix`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

***

### \_validateCannotExceedMaxInteger()

> `protected` **\_validateCannotExceedMaxInteger**(`values`, `bits`?, `cannotEqual`?): `void`

Validates that an object with BigInt values cannot exceed the specified bit limit.

#### Parameters

• **values**

Object containing string keys and BigInt values

• **bits?**: `number`

Number of bits to check (64 or 256)

• **cannotEqual?**: `boolean`

Pass true if the number also cannot equal one less the maximum value

#### Returns

`void`

#### Inherited from

`BaseTransaction._validateCannotExceedMaxInteger`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Returns a new transaction with the same data fields as the current, but now signed

#### Parameters

• **v**: `bigint`

The `v` value of the signature

• **r**: `bigint` \| `Uint8Array`

The `r` value of the signature

• **s**: `bigint` \| `Uint8Array`

The `s` value of the signature

• **convertV?**: `boolean`

Set this to `true` if the raw output of `ecsign` is used. If this is `false` (default)
                then the raw value passed for `v` will be used for the signature. For legacy transactions,
                if this is set to `true`, it will also set the right `v` value for the chain id.

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Overrides

`BaseTransaction.addSignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:147

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

`BaseTransaction.errorStr`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:151

***

### getBaseFee()

> **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

`BaseTransaction.getBaseFee`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

***

### getDataFee()

> **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getDataFee`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:71

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

• **baseFee**: `bigint`

Base fee retrieved from block

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getEffectivePriorityFee`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:38

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getHashedMessageToSign`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:125

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

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getMessageToSign`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:117

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getMessageToVerifySignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:133

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

`BaseTransaction.getSenderAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getSenderPublicKey`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:137

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`?): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

• **baseFee?**: `bigint`

The base fee of the block (will be set to 0 if not provided)

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getUpfrontCost`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:76

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

`BaseTransaction.getValidationErrors`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [BlobEIP4844Transaction.getMessageToSign](BlobEIP4844Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.hash`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:132

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.isSigned`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:116

***

### isValid()

> **isValid**(): `boolean`

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

`BaseTransaction.isValid`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

***

### numBlobs()

> **numBlobs**(): `number`

#### Returns

`number`

the number of blobs included with this transaction

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:162

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

#### Returns

`BlobEIP4844TxValuesArray`

#### Overrides

`BaseTransaction.raw`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:90

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-4844 transaction.

Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.serialize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:101

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:105

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

• **privateKey**: `Uint8Array`

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Inherited from

`BaseTransaction.sign`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:138

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

• **capability**: [`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.supports`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.toCreationAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

`BaseTransaction.toJSON`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:146

***

### verifySignature()

> **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.verifySignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

***

### \_validateNotArray()

> `protected` `static` **\_validateNotArray**(`values`): `void`

#### Parameters

• **values**

#### Returns

`void`

#### Inherited from

`BaseTransaction._validateNotArray`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

***

### fromSerializedBlobTxNetworkWrapper()

> `static` **fromSerializedBlobTxNetworkWrapper**(`serialized`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)

#### Parameters

• **serialized**: `Uint8Array`

a buffer representing a serialized BlobTransactionNetworkWrapper

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

any TxOptions defined

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

a BlobEIP4844Transaction

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:67

***

### fromSerializedTx()

> `static` **fromSerializedTx**(`serialized`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`

#### Parameters

• **serialized**: `Uint8Array`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:53

***

### fromTxData()

> `static` **fromTxData**(`txData`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

• **txData**: `BlobEIP4844TxData`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:33

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

#### Parameters

• **values**: `BlobEIP4844TxValuesArray`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:60

***

### minimalFromNetworkWrapper()

> `static` **minimalFromNetworkWrapper**(`txData`, `opts`?): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates the minimal representation of a blob transaction from the network wrapper version.
The minimal representation is used when adding transactions to an execution payload/block

#### Parameters

• **txData**: [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

a [BlobEIP4844Transaction](BlobEIP4844Transaction.md) containing optional blobs/kzg commitments

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

dictionary of [TxOptions](../interfaces/TxOptions.md)

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:46

***

### networkWrapperToJson()

> `static` **networkWrapperToJson**(`serialized`, `opts`?): `JsonBlobTxNetworkWrapper`

Returns the EIP 4844 transaction network wrapper in JSON format similar to toJSON, including
blobs, commitments, and proofs fields

#### Parameters

• **serialized**: `Uint8Array`

a buffer representing a serialized BlobTransactionNetworkWrapper

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

any TxOptions defined

#### Returns

`JsonBlobTxNetworkWrapper`

JsonBlobTxNetworkWrapper with blobs, KZG commitments, and KZG proofs fields

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:145
