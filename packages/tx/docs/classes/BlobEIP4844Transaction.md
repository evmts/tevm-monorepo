[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / BlobEIP4844Transaction

# Class: BlobEIP4844Transaction

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:22

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

This tx type has two "modes": the plain canonical format only contains `blobVersionedHashes`.
If blobs are passed in the tx automatically switches to "Network Wrapper" format and the
`networkWrapperVersion` will be set or validated.

## Implements

- `TransactionInterface`\<*typeof* [`BlobEIP4844`](../variables/TransactionType.md#blobeip4844)\>

## Constructors

### Constructor

> **new BlobEIP4844Transaction**(`txData`, `opts?`): `Blob4844Tx`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:65

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:29

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:57

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

***

### blobs?

> `optional` **blobs?**: `` `0x${string}` ``[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:46

***

### blobVersionedHashes

> **blobVersionedHashes**: `` `0x${string}` ``[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:34

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:51

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`cache`](../interfaces/EIP4844CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:30

***

### common

> `readonly` **common**: `Common`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:49

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`common`](../interfaces/EIP4844CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:27

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`data`](../interfaces/EIP4844CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:25

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`gasLimit`](../interfaces/EIP4844CompatibleTx.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments?**: `` `0x${string}` ``[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:47

***

### kzgProofs?

> `optional` **kzgProofs?**: `` `0x${string}` ``[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:48

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:33

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:32

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:31

***

### networkWrapperVersion?

> `optional` **networkWrapperVersion?**: `NetworkWrapperType`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:45

This property is set if the tx is in "Network Wrapper" format.

Possible values:
- 0 (EIP-4844)
- 1 (EIP-4844 + EIP-7594)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:24

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`nonce`](../interfaces/EIP4844CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:36

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`r`](../interfaces/EIP4844CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:37

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`s`](../interfaces/EIP4844CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:28

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`to`](../interfaces/EIP4844CompatibleTx.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:50

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`txOptions`](../interfaces/EIP4844CompatibleTx.md#txoptions)

***

### type

> **type**: `3`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:23

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`type`](../interfaces/EIP4844CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:35

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`v`](../interfaces/EIP4844CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:26

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`value`](../interfaces/EIP4844CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `Blob4844Tx`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:191

Adds signature values (and optional network wrapper fields) and returns a new transaction.

#### Parameters

##### v

`bigint`

Recovery parameter

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

Signature `r` value

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

Signature `s` value

#### Returns

`Blob4844Tx`

New `Blob4844Tx` instance containing the signature

#### Implementation of

`TransactionInterface.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:227

Return a compact error string representation of the object

#### Returns

`string`

Human-readable error summary

#### Implementation of

`TransactionInterface.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:91

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getDataGas`

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:87

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:160

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

Keccak hash of the unsigned transaction payload

#### Implementation of

`TransactionInterface.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:107

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:151

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

Serialized unsigned transaction payload

#### Implementation of

`TransactionInterface.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:173

Returns the hashed unsigned transaction that should be used for signature verification.

#### Returns

`Uint8Array`

Hash of the unsigned transaction payload

#### Implementation of

`TransactionInterface.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:210

Returns the recovered sender address.

#### Returns

`Address`

Sender Address

#### Implementation of

`TransactionInterface.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:178

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Implementation of

`TransactionInterface.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee?`): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:96

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:196

Returns validation errors for this transaction, if any.

#### Returns

`string`[]

Array of validation error messages

#### Implementation of

`TransactionInterface.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:168

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [Blob4844Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

`TransactionInterface.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:222

Indicates whether the transaction already carries signature values.

#### Returns

`boolean`

true if signature parts are present

#### Implementation of

`TransactionInterface.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:200

#### Returns

`boolean`

true if the transaction has no validation errors

#### Implementation of

`TransactionInterface.isValid`

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:231

#### Returns

`number`

the number of blobs included with this transaction

***

### raw()

> **raw**(): `BlobEIP4844TxValuesArray`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:121

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:132

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:138

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format
This format is used for gossipping mempool transactions over devp2p or when
submitting a transaction via RPC.

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `Blob4844Tx`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:217

Signs the transaction with the provided private key and returns the signed instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key used for signing

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy passed to the signing routine

#### Returns

`Blob4844Tx`

Newly signed transaction

#### Implementation of

`TransactionInterface.sign`

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:82

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

> **toCreationAddress**(): `never`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:100

Blob4844Tx cannot create contracts

#### Returns

`never`

#### Implementation of

`TransactionInterface.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:183

Produces a JSON representation compliant with the execution API.

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

JSON encoding of the transaction

#### Implementation of

`TransactionInterface.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/4844/tx.d.ts:205

Verifies whether the attached signature is valid.

#### Returns

`boolean`

true if signature verification succeeds

#### Implementation of

`TransactionInterface.verifySignature`
