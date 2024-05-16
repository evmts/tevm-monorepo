[**@tevm/tx**](../README.md) • **Docs**

***

[@tevm/tx](../globals.md) / LegacyTransaction

# Class: LegacyTransaction

An Ethereum non-typed (legacy) transaction

## Extends

- `BaseTransaction`\<[`Legacy`](../enumerations/TransactionType.md#legacy)\>

## Constructors

### new LegacyTransaction()

> **new LegacyTransaction**(`txData`, `opts`?): [`LegacyTransaction`](LegacyTransaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

• **txData**: `LegacyTxData`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Overrides

`BaseTransaction<TransactionType.Legacy>.constructor`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:42

## Properties

### \_type

> `protected` `readonly` **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

`BaseTransaction._type`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

`BaseTransaction.activeCapabilities`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

***

### cache

> **cache**: `TransactionCache`

#### Inherited from

`BaseTransaction.cache`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

***

### common

> `readonly` **common**: `Common`

#### Overrides

`BaseTransaction.common`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:12

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

`BaseTransaction.data`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

`BaseTransaction.gasLimit`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:11

***

### keccakFunction

> `private` **keccakFunction**: `any`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:13

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

`BaseTransaction.nonce`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

***

### r?

> `optional` `readonly` **r**: `bigint`

#### Inherited from

`BaseTransaction.r`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

***

### s?

> `optional` `readonly` **s**: `bigint`

#### Inherited from

`BaseTransaction.s`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

***

### to?

> `optional` `readonly` **to**: `Address`

#### Inherited from

`BaseTransaction.to`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

***

### txOptions

> `protected` `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

#### Inherited from

`BaseTransaction.txOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

***

### v?

> `optional` `readonly` **v**: `bigint`

#### Inherited from

`BaseTransaction.v`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

`BaseTransaction.value`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

> `get` **type**(): [`TransactionType`](../enumerations/TransactionType.md)

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

[`TransactionType`](../enumerations/TransactionType.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

## Methods

### \_getSharedErrorPostfix()

> `protected` **\_getSharedErrorPostfix**(): `string`

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

`BaseTransaction._getSharedErrorPostfix`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

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

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

***

### \_validateTxV()

> `protected` **\_validateTxV**(`_v`?, `common`?): `Common`

Validates tx's `v` value

#### Parameters

• **\_v?**: `bigint`

• **common?**: `Common`

#### Returns

`Common`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:118

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`LegacyTransaction`](LegacyTransaction.md)

#### Parameters

• **v**: `bigint`

• **r**: `bigint` \| `Uint8Array`

• **s**: `bigint` \| `Uint8Array`

• **convertV?**: `boolean`

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Overrides

`BaseTransaction.addSignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:110

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

`BaseTransaction.errorStr`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:122

***

### getBaseFee()

> **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

`BaseTransaction.getBaseFee`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

***

### getDataFee()

> **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getDataFee`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:90

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`?): `bigint`

#### Parameters

• **baseFee?**: `bigint`

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getEffectivePriorityFee`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:43

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getHashedMessageToSign`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:86

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`[]

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

`BaseTransaction.getMessageToSign`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:81

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getMessageToVerifySignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:105

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

`BaseTransaction.getSenderAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getSenderPublicKey`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:109

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getUpfrontCost`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:94

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

`BaseTransaction.getValidationErrors`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.hash`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:101

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.isSigned`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:116

***

### isValid()

> **isValid**(): `boolean`

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

`BaseTransaction.isValid`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

***

### raw()

> **raw**(): `LegacyTxValuesArray`

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

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:57

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the serialized encoding of the legacy transaction.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

For an unsigned tx this method uses the empty Uint8Array values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use Transaction.getMessageToSign.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.serialize`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:67

***

### sign()

> **sign**(`privateKey`): [`LegacyTransaction`](LegacyTransaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Inherited from

`BaseTransaction.sign`

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

• **capability**: [`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.supports`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.toCreationAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Returns an object with the JSON representation of the transaction.

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Overrides

`BaseTransaction.toJSON`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:114

***

### verifySignature()

> **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.verifySignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

***

### \_validateNotArray()

> `static` `protected` **\_validateNotArray**(`values`): `void`

#### Parameters

• **values**

#### Returns

`void`

#### Inherited from

`BaseTransaction._validateNotArray`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

***

### fromSerializedTx()

> `static` **fromSerializedTx**(`serialized`, `opts`?): [`LegacyTransaction`](LegacyTransaction.md)

Instantiate a transaction from the serialized tx.

Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`

#### Parameters

• **serialized**: `Uint8Array`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:28

***

### fromTxData()

> `static` **fromTxData**(`txData`, `opts`?): [`LegacyTransaction`](LegacyTransaction.md)

Instantiate a transaction from a data dictionary.

Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }

Notes:
- All parameters are optional and have some basic default values

#### Parameters

• **txData**: `LegacyTxData`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:22

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`?): [`LegacyTransaction`](LegacyTransaction.md)

Create a transaction from a values array.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

#### Parameters

• **values**: `LegacyTxValuesArray`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`LegacyTransaction`](LegacyTransaction.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/legacyTransaction.d.ts:34
