[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / LegacyTransaction

# Class: LegacyTransaction

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:10

An Ethereum non-typed (legacy) transaction

## Extends

- `BaseTransaction`\<[`Legacy`](../enumerations/TransactionType.md#legacy)\>

## Constructors

### new LegacyTransaction()

> **new LegacyTransaction**(`txData`, `opts`?): `LegacyTransaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:42

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

`LegacyTxData`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`LegacyTransaction`

#### Overrides

`BaseTransaction<TransactionType.Legacy>.constructor`

## Properties

### \_type

> `protected` `readonly` **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

#### Inherited from

`BaseTransaction._type`

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

`BaseTransaction.activeCapabilities`

***

### cache

> **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

#### Inherited from

`BaseTransaction.cache`

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:12

#### Overrides

`BaseTransaction.common`

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

#### Inherited from

`BaseTransaction.data`

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

#### Inherited from

`BaseTransaction.gasLimit`

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:11

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

#### Inherited from

`BaseTransaction.nonce`

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

#### Inherited from

`BaseTransaction.r`

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

#### Inherited from

`BaseTransaction.s`

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

#### Inherited from

`BaseTransaction.to`

***

### txOptions

> `protected` `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

#### Inherited from

`BaseTransaction.txOptions`

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

#### Inherited from

`BaseTransaction.v`

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

#### Inherited from

`BaseTransaction.value`

## Accessors

### type

#### Get Signature

> **get** **type**(): [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

Returns the transaction type.

Note: legacy txs will return tx type `0`.

##### Returns

[`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

`BaseTransaction.type`

## Methods

### \_getSharedErrorPostfix()

> `protected` **\_getSharedErrorPostfix**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

`BaseTransaction._getSharedErrorPostfix`

***

### \_validateCannotExceedMaxInteger()

> `protected` **\_validateCannotExceedMaxInteger**(`values`, `bits`?, `cannotEqual`?): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

Validates that an object with BigInt values cannot exceed the specified bit limit.

#### Parameters

##### values

Object containing string keys and BigInt values

##### bits?

`number`

Number of bits to check (64 or 256)

##### cannotEqual?

`boolean`

Pass true if the number also cannot equal one less the maximum value

#### Returns

`void`

#### Inherited from

`BaseTransaction._validateCannotExceedMaxInteger`

***

### \_validateTxV()

> `protected` **\_validateTxV**(`_v`?, `common`?): `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:118

Validates tx's `v` value

#### Parameters

##### \_v?

`bigint`

##### common?

`Common`

#### Returns

`Common`

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): `LegacyTransaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:110

Returns a new transaction with the same data fields as the current, but now signed

#### Parameters

##### v

`bigint`

The `v` value of the signature

##### r

The `r` value of the signature

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

The `s` value of the signature

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

Set this to `true` if the raw output of `ecsign` is used. If this is `false` (default)
                then the raw value passed for `v` will be used for the signature. For legacy transactions,
                if this is set to `true`, it will also set the right `v` value for the chain id.

#### Returns

`LegacyTransaction`

#### Overrides

`BaseTransaction.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:122

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

`BaseTransaction.errorStr`

***

### getBaseFee()

> **getBaseFee**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

`BaseTransaction.getBaseFee`

***

### getDataFee()

> **getDataFee**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:90

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getDataFee`

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`?): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:43

Returns the effective priority fee. This is the priority fee which the coinbase will receive
once it is included in the block

#### Parameters

##### baseFee?

`bigint`

Optional baseFee of the block. Note for EIP1559 and EIP4844 this is required.

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getEffectivePriorityFee`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:86

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getHashedMessageToSign`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:81

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

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Overrides

`BaseTransaction.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:105

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

Returns the sender's address

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`BaseTransaction.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:109

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:94

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

`BaseTransaction.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:101

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:116

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

`BaseTransaction.isValid`

***

### raw()

> **raw**(): `LegacyTxValuesArray`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:57

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

`BaseTransaction.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:67

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned tx this method uses the empty Uint8Array values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use Transaction.getMessageToSign.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.serialize`

***

### sign()

> **sign**(`privateKey`): `LegacyTransaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:138

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

`LegacyTransaction`

#### Inherited from

`BaseTransaction.sign`

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

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

[`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:114

Returns an object with the JSON representation of the transaction.

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

`BaseTransaction.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.verifySignature`

***

### \_validateNotArray()

> `protected` `static` **\_validateNotArray**(`values`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

#### Parameters

##### values

#### Returns

`void`

#### Inherited from

`BaseTransaction._validateNotArray`

***

### fromSerializedTx()

> `static` **fromSerializedTx**(`serialized`, `opts`?): `LegacyTransaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:28

Instantiate a transaction from the serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

#### Parameters

##### serialized

`Uint8Array`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`LegacyTransaction`

***

### fromTxData()

> `static` **fromTxData**(`txData`, `opts`?): `LegacyTransaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:22

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

#### Parameters

##### txData

`LegacyTxData`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`LegacyTransaction`

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`?): `LegacyTransaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:34

Create a transaction from a values array.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

#### Parameters

##### values

`LegacyTxValuesArray`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`LegacyTransaction`
