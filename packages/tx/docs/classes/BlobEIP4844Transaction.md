[@tevm/tx](../README.md) / [Exports](../modules.md) / BlobEIP4844Transaction

# Class: BlobEIP4844Transaction

Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data

- TransactionType: 3
- EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)

## Hierarchy

- `BaseTransaction`\<`TransactionType.BlobEIP4844`\>

  ↳ **`BlobEIP4844Transaction`**

## Table of contents

### Constructors

- [constructor](BlobEIP4844Transaction.md#constructor)

### Properties

- [AccessListJSON](BlobEIP4844Transaction.md#accesslistjson)
- [\_type](BlobEIP4844Transaction.md#_type)
- [accessList](BlobEIP4844Transaction.md#accesslist)
- [activeCapabilities](BlobEIP4844Transaction.md#activecapabilities)
- [blobVersionedHashes](BlobEIP4844Transaction.md#blobversionedhashes)
- [blobs](BlobEIP4844Transaction.md#blobs)
- [cache](BlobEIP4844Transaction.md#cache)
- [chainId](BlobEIP4844Transaction.md#chainid)
- [common](BlobEIP4844Transaction.md#common)
- [data](BlobEIP4844Transaction.md#data)
- [gasLimit](BlobEIP4844Transaction.md#gaslimit)
- [kzgCommitments](BlobEIP4844Transaction.md#kzgcommitments)
- [kzgProofs](BlobEIP4844Transaction.md#kzgproofs)
- [maxFeePerBlobGas](BlobEIP4844Transaction.md#maxfeeperblobgas)
- [maxFeePerGas](BlobEIP4844Transaction.md#maxfeepergas)
- [maxPriorityFeePerGas](BlobEIP4844Transaction.md#maxpriorityfeepergas)
- [nonce](BlobEIP4844Transaction.md#nonce)
- [r](BlobEIP4844Transaction.md#r)
- [s](BlobEIP4844Transaction.md#s)
- [to](BlobEIP4844Transaction.md#to)
- [txOptions](BlobEIP4844Transaction.md#txoptions)
- [v](BlobEIP4844Transaction.md#v)
- [value](BlobEIP4844Transaction.md#value)

### Accessors

- [type](BlobEIP4844Transaction.md#type)

### Methods

- [\_getSharedErrorPostfix](BlobEIP4844Transaction.md#_getsharederrorpostfix)
- [\_validateCannotExceedMaxInteger](BlobEIP4844Transaction.md#_validatecannotexceedmaxinteger)
- [addSignature](BlobEIP4844Transaction.md#addsignature)
- [errorStr](BlobEIP4844Transaction.md#errorstr)
- [getBaseFee](BlobEIP4844Transaction.md#getbasefee)
- [getDataFee](BlobEIP4844Transaction.md#getdatafee)
- [getEffectivePriorityFee](BlobEIP4844Transaction.md#geteffectivepriorityfee)
- [getHashedMessageToSign](BlobEIP4844Transaction.md#gethashedmessagetosign)
- [getMessageToSign](BlobEIP4844Transaction.md#getmessagetosign)
- [getMessageToVerifySignature](BlobEIP4844Transaction.md#getmessagetoverifysignature)
- [getSenderAddress](BlobEIP4844Transaction.md#getsenderaddress)
- [getSenderPublicKey](BlobEIP4844Transaction.md#getsenderpublickey)
- [getUpfrontCost](BlobEIP4844Transaction.md#getupfrontcost)
- [getValidationErrors](BlobEIP4844Transaction.md#getvalidationerrors)
- [hash](BlobEIP4844Transaction.md#hash)
- [isSigned](BlobEIP4844Transaction.md#issigned)
- [isValid](BlobEIP4844Transaction.md#isvalid)
- [numBlobs](BlobEIP4844Transaction.md#numblobs)
- [raw](BlobEIP4844Transaction.md#raw)
- [serialize](BlobEIP4844Transaction.md#serialize)
- [serializeNetworkWrapper](BlobEIP4844Transaction.md#serializenetworkwrapper)
- [sign](BlobEIP4844Transaction.md#sign)
- [supports](BlobEIP4844Transaction.md#supports)
- [toCreationAddress](BlobEIP4844Transaction.md#tocreationaddress)
- [toJSON](BlobEIP4844Transaction.md#tojson)
- [verifySignature](BlobEIP4844Transaction.md#verifysignature)
- [\_validateNotArray](BlobEIP4844Transaction.md#_validatenotarray)
- [fromSerializedBlobTxNetworkWrapper](BlobEIP4844Transaction.md#fromserializedblobtxnetworkwrapper)
- [fromSerializedTx](BlobEIP4844Transaction.md#fromserializedtx)
- [fromTxData](BlobEIP4844Transaction.md#fromtxdata)
- [fromValuesArray](BlobEIP4844Transaction.md#fromvaluesarray)
- [minimalFromNetworkWrapper](BlobEIP4844Transaction.md#minimalfromnetworkwrapper)

## Constructors

### constructor

• **new BlobEIP4844Transaction**(`txData`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static constructors or factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `BlobEIP4844TxData` |
| `opts?` | `TxOptions` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Overrides

BaseTransaction\&lt;TransactionType.BlobEIP4844\&gt;.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:32

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: `AccessList`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:16

___

### \_type

• `Protected` `Readonly` **\_type**: `TransactionType`

#### Inherited from

BaseTransaction.\_type

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

___

### accessList

• `Readonly` **accessList**: `AccessListBytes`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:15

___

### activeCapabilities

• `Protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

BaseTransaction.activeCapabilities

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

___

### blobVersionedHashes

• **blobVersionedHashes**: `Uint8Array`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:21

___

### blobs

• `Optional` **blobs**: `Uint8Array`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:22

___

### cache

• **cache**: `TransactionCache`

#### Inherited from

BaseTransaction.cache

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:14

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:20

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

BaseTransaction.data

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

BaseTransaction.gasLimit

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

___

### kzgCommitments

• `Optional` **kzgCommitments**: `Uint8Array`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:23

___

### kzgProofs

• `Optional` **kzgProofs**: `Uint8Array`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:24

___

### maxFeePerBlobGas

• `Readonly` **maxFeePerBlobGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:19

___

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:18

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:17

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

BaseTransaction.nonce

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

BaseTransaction.r

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

BaseTransaction.s

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

BaseTransaction.to

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

___

### txOptions

• `Protected` `Readonly` **txOptions**: `TxOptions`

#### Inherited from

BaseTransaction.txOptions

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

BaseTransaction.v

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

BaseTransaction.value

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

• `get` **type**(): `TransactionType`

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

`TransactionType`

#### Inherited from

BaseTransaction.type

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

## Methods

### \_getSharedErrorPostfix

▸ **_getSharedErrorPostfix**(): `string`

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

BaseTransaction.\_getSharedErrorPostfix

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

___

### \_validateCannotExceedMaxInteger

▸ **_validateCannotExceedMaxInteger**(`values`, `bits?`, `cannotEqual?`): `void`

Validates that an object with BigInt values cannot exceed the specified bit limit.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Object` | Object containing string keys and BigInt values |
| `bits?` | `number` | Number of bits to check (64 or 256) |
| `cannotEqual?` | `boolean` | Pass true if the number also cannot equal one less the maximum value |

#### Returns

`void`

#### Inherited from

BaseTransaction.\_validateCannotExceedMaxInteger

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

___

### addSignature

▸ **addSignature**(`v`, `r`, `s`, `convertV?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `bigint` \| `Uint8Array` |
| `s` | `bigint` \| `Uint8Array` |
| `convertV?` | `boolean` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Overrides

BaseTransaction.addSignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:139

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:143

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

BaseTransaction.getBaseFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

___

### getDataFee

▸ **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

BaseTransaction.getDataFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:71

___

### getEffectivePriorityFee

▸ **getEffectivePriorityFee**(`baseFee`): `bigint`

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFee` | `bigint` | Base fee retrieved from block |

#### Returns

`bigint`

#### Overrides

BaseTransaction.getEffectivePriorityFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:38

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getHashedMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:125

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

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

BaseTransaction.getMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:117

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:133

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

BaseTransaction.getSenderAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getSenderPublicKey

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:137

___

### getUpfrontCost

▸ **getUpfrontCost**(`baseFee?`): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFee?` | `bigint` | The base fee of the block (will be set to 0 if not provided) |

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:76

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

BaseTransaction.getValidationErrors

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

___

### hash

▸ **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [BlobEIP4844Transaction.getMessageToSign](BlobEIP4844Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.hash

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:132

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

BaseTransaction.isSigned

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:116

___

### isValid

▸ **isValid**(): `boolean`

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

BaseTransaction.isValid

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

___

### numBlobs

▸ **numBlobs**(): `number`

#### Returns

`number`

the number of blobs included with this transaction

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:154

___

### raw

▸ **raw**(): `BlobEIP4844TxValuesArray`

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

BaseTransaction.raw

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:90

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-4844 transaction.

Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.serialize

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:101

___

### serializeNetworkWrapper

▸ **serializeNetworkWrapper**(): `Uint8Array`

#### Returns

`Uint8Array`

the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:105

___

### sign

▸ **sign**(`privateKey`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Inherited from

BaseTransaction.sign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:138

___

### supports

▸ **supports**(`capability`): `boolean`

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

| Name | Type |
| :------ | :------ |
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.supports

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

BaseTransaction.toCreationAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

___

### toJSON

▸ **toJSON**(): `JsonTx`

#### Returns

`JsonTx`

#### Overrides

BaseTransaction.toJSON

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:138

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

BaseTransaction.verifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

___

### \_validateNotArray

▸ **_validateNotArray**(`values`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Object` |

#### Returns

`void`

#### Inherited from

BaseTransaction.\_validateNotArray

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

___

### fromSerializedBlobTxNetworkWrapper

▸ **fromSerializedBlobTxNetworkWrapper**(`serialized`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serialized` | `Uint8Array` | a buffer representing a serialized BlobTransactionNetworkWrapper |
| `opts?` | `TxOptions` | any TxOptions defined |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

a BlobEIP4844Transaction

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:67

___

### fromSerializedTx

▸ **fromSerializedTx**(`serialized`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts?` | `TxOptions` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:53

___

### fromTxData

▸ **fromTxData**(`txData`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `BlobEIP4844TxData` |
| `opts?` | `TxOptions` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:33

___

### fromValuesArray

▸ **fromValuesArray**(`values`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `BlobEIP4844TxValuesArray` |
| `opts?` | `TxOptions` |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:60

___

### minimalFromNetworkWrapper

▸ **minimalFromNetworkWrapper**(`txData`, `opts?`): [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

Creates the minimal representation of a blob transaction from the network wrapper version.
The minimal representation is used when adding transactions to an execution payload/block

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txData` | [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) | a [BlobEIP4844Transaction](BlobEIP4844Transaction.md) containing optional blobs/kzg commitments |
| `opts?` | `TxOptions` | dictionary of TxOptions |

#### Returns

[`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip4844Transaction.d.ts:46
