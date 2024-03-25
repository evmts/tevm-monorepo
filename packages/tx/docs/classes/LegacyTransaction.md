[@tevm/tx](../README.md) / [Exports](../modules.md) / LegacyTransaction

# Class: LegacyTransaction

An Ethereum non-typed (legacy) transaction

## Hierarchy

- `BaseTransaction`\<`TransactionType.Legacy`\>

  ↳ **`LegacyTransaction`**

## Table of contents

### Constructors

- [constructor](LegacyTransaction.md#constructor)

### Properties

- [\_type](LegacyTransaction.md#_type)
- [activeCapabilities](LegacyTransaction.md#activecapabilities)
- [cache](LegacyTransaction.md#cache)
- [common](LegacyTransaction.md#common)
- [data](LegacyTransaction.md#data)
- [gasLimit](LegacyTransaction.md#gaslimit)
- [gasPrice](LegacyTransaction.md#gasprice)
- [keccakFunction](LegacyTransaction.md#keccakfunction)
- [nonce](LegacyTransaction.md#nonce)
- [r](LegacyTransaction.md#r)
- [s](LegacyTransaction.md#s)
- [to](LegacyTransaction.md#to)
- [txOptions](LegacyTransaction.md#txoptions)
- [v](LegacyTransaction.md#v)
- [value](LegacyTransaction.md#value)

### Accessors

- [type](LegacyTransaction.md#type)

### Methods

- [\_getSharedErrorPostfix](LegacyTransaction.md#_getsharederrorpostfix)
- [\_validateCannotExceedMaxInteger](LegacyTransaction.md#_validatecannotexceedmaxinteger)
- [\_validateTxV](LegacyTransaction.md#_validatetxv)
- [addSignature](LegacyTransaction.md#addsignature)
- [errorStr](LegacyTransaction.md#errorstr)
- [getBaseFee](LegacyTransaction.md#getbasefee)
- [getDataFee](LegacyTransaction.md#getdatafee)
- [getEffectivePriorityFee](LegacyTransaction.md#geteffectivepriorityfee)
- [getHashedMessageToSign](LegacyTransaction.md#gethashedmessagetosign)
- [getMessageToSign](LegacyTransaction.md#getmessagetosign)
- [getMessageToVerifySignature](LegacyTransaction.md#getmessagetoverifysignature)
- [getSenderAddress](LegacyTransaction.md#getsenderaddress)
- [getSenderPublicKey](LegacyTransaction.md#getsenderpublickey)
- [getUpfrontCost](LegacyTransaction.md#getupfrontcost)
- [getValidationErrors](LegacyTransaction.md#getvalidationerrors)
- [hash](LegacyTransaction.md#hash)
- [isSigned](LegacyTransaction.md#issigned)
- [isValid](LegacyTransaction.md#isvalid)
- [raw](LegacyTransaction.md#raw)
- [serialize](LegacyTransaction.md#serialize)
- [sign](LegacyTransaction.md#sign)
- [supports](LegacyTransaction.md#supports)
- [toCreationAddress](LegacyTransaction.md#tocreationaddress)
- [toJSON](LegacyTransaction.md#tojson)
- [verifySignature](LegacyTransaction.md#verifysignature)
- [\_validateNotArray](LegacyTransaction.md#_validatenotarray)
- [fromSerializedTx](LegacyTransaction.md#fromserializedtx)
- [fromTxData](LegacyTransaction.md#fromtxdata)
- [fromValuesArray](LegacyTransaction.md#fromvaluesarray)

## Constructors

### constructor

• **new LegacyTransaction**(`txData`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `LegacyTxData` |
| `opts?` | `TxOptions` |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Overrides

BaseTransaction\&lt;TransactionType.Legacy\&gt;.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:42

## Properties

### \_type

• `Protected` `Readonly` **\_type**: `TransactionType`

#### Inherited from

BaseTransaction.\_type

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

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

### cache

• **cache**: `TransactionCache`

#### Inherited from

BaseTransaction.cache

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:12

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

### gasPrice

• `Readonly` **gasPrice**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:11

___

### keccakFunction

• `Private` **keccakFunction**: `any`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:13

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

### \_validateTxV

▸ **_validateTxV**(`_v?`, `common?`): `Common`

Validates tx's `v` value

#### Parameters

| Name | Type |
| :------ | :------ |
| `_v?` | `bigint` |
| `common?` | `Common` |

#### Returns

`Common`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:118

___

### addSignature

▸ **addSignature**(`v`, `r`, `s`, `convertV?`): [`LegacyTransaction`](LegacyTransaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `bigint` \| `Uint8Array` |
| `s` | `bigint` \| `Uint8Array` |
| `convertV?` | `boolean` |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Overrides

BaseTransaction.addSignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:110

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:122

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

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:90

___

### getEffectivePriorityFee

▸ **getEffectivePriorityFee**(`baseFee?`): `bigint`

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseFee?` | `bigint` |

#### Returns

`bigint`

#### Overrides

BaseTransaction.getEffectivePriorityFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:43

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getHashedMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:86

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`[]

Returns the raw unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: the raw message message format for the legacy tx is not RLP encoded
and you might need to do yourself with:

```javascript
import { RLP } from '@ethereumjs/rlp'
const message = tx.getMessageToSign()
const serializedMessage = RLP.encode(message)) // use this for the HW wallet input
```

#### Returns

`Uint8Array`[]

#### Overrides

BaseTransaction.getMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:81

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:105

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

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:109

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:94

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
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.hash

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:101

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

### raw

▸ **raw**(): `LegacyTxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the legacy transaction, in order.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

For legacy txs this is also the correct format to add transactions
to a block with Block.fromValuesArray (use the `serialize()` method
for typed txs).

For an unsigned tx this method returns the empty Bytes values
for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
representation have a look at Transaction.getMessageToSign.

#### Returns

`LegacyTxValuesArray`

#### Overrides

BaseTransaction.raw

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:57

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned tx this method uses the empty Uint8Array values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use Transaction.getMessageToSign.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.serialize

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:67

___

### sign

▸ **sign**(`privateKey`): [`LegacyTransaction`](LegacyTransaction.md)

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

[`LegacyTransaction`](LegacyTransaction.md)

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

Returns an object with the JSON representation of the transaction.

#### Returns

`JsonTx`

#### Overrides

BaseTransaction.toJSON

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:114

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

### fromSerializedTx

▸ **fromSerializedTx**(`serialized`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

Instantiate a transaction from the serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts?` | `TxOptions` |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:28

___

### fromTxData

▸ **fromTxData**(`txData`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `LegacyTxData` |
| `opts?` | `TxOptions` |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:22

___

### fromValuesArray

▸ **fromValuesArray**(`values`, `opts?`): [`LegacyTransaction`](LegacyTransaction.md)

Create a transaction from a values array.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `LegacyTxValuesArray` |
| `opts?` | `TxOptions` |

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:34
