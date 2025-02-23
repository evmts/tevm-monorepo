[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [tx](../README.md) / AccessListEIP2930Transaction

# Class: AccessListEIP2930Transaction

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Extends

- `BaseTransaction`\<[`AccessListEIP2930`](../enumerations/TransactionType.md#accesslisteip2930)\>

## Constructors

### new AccessListEIP2930Transaction()

> **new AccessListEIP2930Transaction**(`txData`, `opts`?): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

• **txData**: `AccessListEIP2930TxData`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Overrides

`BaseTransaction<TransactionType.AccessListEIP2930>.constructor`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:51

## Properties

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:15

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:16

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:14

***

### common

> `readonly` **common**: `Common`

#### Overrides

`BaseTransaction.common`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:18

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

### gasPrice

> `readonly` **gasPrice**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:17

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

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

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

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

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

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Overrides

`BaseTransaction.addSignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:121

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

`BaseTransaction.errorStr`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:129

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:56

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`?): `bigint`

Returns the effective priority fee. This is the priority fee which the coinbase will receive
once it is included in the block

#### Parameters

• **baseFee?**: `bigint`

Optional baseFee of the block. Note for EIP1559 and EIP4844 this is required.

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getEffectivePriorityFee`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:52

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:105

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:97

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getMessageToVerifySignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:116

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns the sender's address

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:120

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getUpfrontCost`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:60

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
Use [AccessListEIP2930Transaction.getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.hash`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:112

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

### raw()

> **raw**(): `AccessListEIP2930TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-2930 transaction, in order.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

Use [AccessListEIP2930Transaction.serialize](AccessListEIP2930Transaction.md#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [AccessListEIP2930Transaction.getMessageToSign](AccessListEIP2930Transaction.md#getmessagetosign).

#### Returns

`AccessListEIP2930TxValuesArray`

#### Overrides

`BaseTransaction.raw`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:74

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-2930 transaction.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.serialize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:85

***

### sign()

> **sign**(`privateKey`): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

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

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:125

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

### fromSerializedTx()

> `static` **fromSerializedTx**(`serialized`, `opts`?): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)])`

#### Parameters

• **serialized**: `Uint8Array`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:36

***

### fromTxData()

> `static` **fromTxData**(`txData`, `opts`?): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

#### Parameters

• **txData**: `AccessListEIP2930TxData`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:29

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`?): [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

#### Parameters

• **values**: `AccessListEIP2930TxValuesArray`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

#### Returns

[`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip2930Transaction.d.ts:43
