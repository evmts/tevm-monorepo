[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / FeeMarketEIP1559Transaction

# Class: FeeMarketEIP1559Transaction

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extended by

- [`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)

## Implements

- `TransactionInterface`\<*typeof* [`FeeMarketEIP1559`](../variables/TransactionType.md#feemarketeip1559)\>

## Constructors

### Constructor

> **new FeeMarketEIP1559Transaction**(`txData`, `opts?`): `FeeMarket1559Tx`

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

`FeeMarketEIP1559TxData`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`FeeMarket1559Tx`

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Implementation of

`TransactionInterface.cache`

***

### chainId

> `readonly` **chainId**: `bigint`

***

### common

> `readonly` **common**: `Common`

#### Implementation of

`TransactionInterface.common`

***

### data

> `readonly` **data**: `Uint8Array`

#### Implementation of

`TransactionInterface.data`

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Implementation of

`TransactionInterface.gasLimit`

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

***

### nonce

> `readonly` **nonce**: `bigint`

#### Implementation of

`TransactionInterface.nonce`

***

### r?

> `readonly` `optional` **r?**: `bigint`

#### Implementation of

`TransactionInterface.r`

***

### s?

> `readonly` `optional` **s?**: `bigint`

#### Implementation of

`TransactionInterface.s`

***

### to?

> `readonly` `optional` **to?**: `Address`

#### Implementation of

`TransactionInterface.to`

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

#### Implementation of

`TransactionInterface.txOptions`

***

### type

> **type**: `2`

#### Implementation of

`TransactionInterface.type`

***

### v?

> `readonly` `optional` **v?**: `bigint`

#### Implementation of

`TransactionInterface.v`

***

### value

> `readonly` **value**: `bigint`

#### Implementation of

`TransactionInterface.value`

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `FeeMarket1559Tx`

Adds signature values and returns a new EIP-1559 transaction instance.

#### Parameters

##### v

`bigint`

Recovery parameter (y-parity)

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

Signature `r` value

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

Signature `s` value

#### Returns

`FeeMarket1559Tx`

Newly created transaction that includes the signature

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

> **getEffectivePriorityFee**(`baseFee`): `bigint`

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

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

Hash used when verifying the signature

#### Implementation of

`TransactionInterface.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Recovers the sender address from the signature.

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

> **getUpfrontCost**(`baseFee?`): `bigint`

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

Runs validation logic and returns encountered errors, if any.

#### Returns

`string`[]

Array of validation error messages.

#### Implementation of

`TransactionInterface.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

`TransactionInterface.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Reports whether the transaction already contains `v`, `r`, and `s`.

#### Returns

`boolean`

true if signature parts are present

#### Implementation of

`TransactionInterface.isSigned`

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

true if the transaction passes validation

#### Implementation of

`TransactionInterface.isValid`

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarket1559Tx.serialize](#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarket1559Tx.getMessageToSign](#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Implementation of

`TransactionInterface.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-1559 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `FeeMarket1559Tx`

Signs the transaction with the provided private key and returns the signed instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy passed to the signing routine

#### Returns

`FeeMarket1559Tx`

Newly signed transaction

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

##### capability

`number`

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

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

JSON encoding of the transaction

#### Implementation of

`TransactionInterface.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Verifies the embedded signature.

#### Returns

`boolean`

true if signature verification succeeds

#### Implementation of

`TransactionInterface.verifySignature`
