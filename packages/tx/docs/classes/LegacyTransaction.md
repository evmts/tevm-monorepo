[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / LegacyTransaction

# Class: LegacyTransaction

An Ethereum non-typed (legacy) transaction

## Implements

- `TransactionInterface`\<*typeof* [`Legacy`](../variables/TransactionType.md#legacy)\>

## Constructors

### Constructor

> **new LegacyTransaction**(`txData`, `opts?`): `LegacyTx`

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `txData` | `LegacyTxData` |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

`LegacyTx`

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="activecapabilities"></a> `activeCapabilities` | `protected` | `number`[] | List of tx type defining EIPs, e.g. 1559 (fee market) and 2930 (access lists) for FeeMarket1559Tx objects |
| <a id="cache"></a> `cache` | `readonly` | `TransactionCache` | - |
| <a id="common"></a> `common` | `readonly` | `Common` | - |
| <a id="data"></a> `data` | `readonly` | `Uint8Array` | - |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | - |
| <a id="gasprice"></a> `gasPrice` | `readonly` | `bigint` | - |
| <a id="nonce"></a> `nonce` | `readonly` | `bigint` | - |
| <a id="r"></a> `r?` | `readonly` | `bigint` | - |
| <a id="s"></a> `s?` | `readonly` | `bigint` | - |
| <a id="to"></a> `to?` | `readonly` | `Address` | - |
| <a id="txoptions"></a> `txOptions` | `readonly` | [`TxOptions`](../interfaces/TxOptions.md) | - |
| <a id="type"></a> `type` | `public` | `0` | - |
| <a id="v"></a> `v?` | `readonly` | `bigint` | - |
| <a id="value"></a> `value` | `readonly` | `bigint` | - |

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): `LegacyTx`

Adds a signature (or replaces an existing one) and returns a new transaction instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `bigint` | Recovery parameter, potentially unconverted when `convertV` is false |
| `r` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | `r` value of the signature |
| `s` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | `s` value of the signature |
| `convertV?` | `boolean` | When true, converts the recovery ID into the appropriate legacy `v` |

#### Returns

`LegacyTx`

A new `LegacyTx` that includes the provided signature

#### Implementation of

`TransactionInterface.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

Human-readable error summary

#### Implementation of

`TransactionInterface.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getDataGas`

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee?`): `bigint`

Computes the effective priority fee for this legacy transaction, optionally considering a base fee.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseFee?` | `bigint` | Optional base fee used on networks that emulate 1559-style pricing |

#### Returns

`bigint`

Priority fee portion denominated in wei

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\>

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

Hash of the unsigned transaction payload

#### Implementation of

`TransactionInterface.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

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

> **getMessageToSign**(): `Uint8Array`\<`ArrayBufferLike`\>[]

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

Array representing the unsigned transaction fields

#### Implementation of

`TransactionInterface.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`\<`ArrayBufferLike`\>

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

Hash used when verifying the signature

#### Implementation of

`TransactionInterface.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Returns the recovered sender address.

#### Returns

`Address`

Sender Address

#### Implementation of

`TransactionInterface.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Implementation of

`TransactionInterface.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Validates the transaction and returns any encountered errors.

#### Returns

`string`[]

Array containing validation error messages

#### Implementation of

`TransactionInterface.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

`TransactionInterface.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Indicates whether the transaction already contains signature values.

#### Returns

`boolean`

true if `v`, `r`, and `s` are populated

#### Implementation of

`TransactionInterface.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Determines whether the transaction passes all validation checks.

#### Returns

`boolean`

true if no validation errors were found

#### Implementation of

`TransactionInterface.isValid`

***

### raw()

> **raw**(): `LegacyTxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the legacy transaction, in order.

Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`

For legacy txs this is also the correct format to add transactions
to a block with createBlockFromBytesArray (use the `serialize()` method
for typed txs).

For an unsigned tx this method returns the empty Bytes values
for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
representation have a look at Transaction.getMessageToSign.

#### Returns

`LegacyTxValuesArray`

#### Implementation of

`TransactionInterface.raw`

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

#### Implementation of

`TransactionInterface.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `LegacyTx`

Signs the transaction with the provided private key and returns the new signed instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `privateKey` | `Uint8Array` | 32-byte private key used to sign the transaction |
| `extraEntropy?` | `boolean` \| `Uint8Array`\<`ArrayBufferLike`\> | Optional entropy passed to the signing routine |

#### Returns

`LegacyTx`

A new signed `LegacyTx`

#### Implementation of

`TransactionInterface.sign`

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

| Parameter | Type |
| ------ | ------ |
| `capability` | `number` |

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Returns an object with the JSON representation of the transaction.

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

JSON encoding of the transaction

#### Implementation of

`TransactionInterface.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Checks whether the stored signature can be successfully verified.

#### Returns

`boolean`

true if the signature is valid

#### Implementation of

`TransactionInterface.verifySignature`
