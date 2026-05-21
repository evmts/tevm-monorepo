[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / AccessListEIP2930Transaction

# Class: AccessListEIP2930Transaction

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Implements

- `TransactionInterface`\<*typeof* [`AccessListEIP2930`](../variables/TransactionType.md#accesslisteip2930)\>

## Constructors

### Constructor

> **new AccessListEIP2930Transaction**(`txData`, `opts?`): `AccessList2930Tx`

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

##### txData

`AccessList2930TxData`

##### opts?

[`TxOptions`](../interfaces/TxOptions.md)

#### Returns

`AccessList2930Tx`

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

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`cache`](../interfaces/EIP4844CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

***

### common

> `readonly` **common**: `Common`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`common`](../interfaces/EIP4844CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`data`](../interfaces/EIP4844CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`gasLimit`](../interfaces/EIP4844CompatibleTx.md#gaslimit)

***

### gasPrice

> `readonly` **gasPrice**: `bigint`

***

### nonce

> `readonly` **nonce**: `bigint`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`nonce`](../interfaces/EIP4844CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`r`](../interfaces/EIP4844CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`s`](../interfaces/EIP4844CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`to`](../interfaces/EIP4844CompatibleTx.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`txOptions`](../interfaces/EIP4844CompatibleTx.md#txoptions)

***

### type

> **type**: `1`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`type`](../interfaces/EIP4844CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`v`](../interfaces/EIP4844CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

#### Implementation of

[`EIP4844CompatibleTx`](../interfaces/EIP4844CompatibleTx.md).[`value`](../interfaces/EIP4844CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `AccessList2930Tx`

Adds the provided signature values and returns a new transaction instance.

#### Parameters

##### v

`bigint`

Recovery parameter (y-parity)

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

`r` component of the signature

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

`s` component of the signature

#### Returns

`AccessList2930Tx`

New `AccessList2930Tx` with the supplied signature

#### Implementation of

`TransactionInterface.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

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

#### Parameters

##### baseFee?

`bigint`

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

Returns the signer's address recovered from the signature.

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

Runs transaction validation and returns any discovered errors.

#### Returns

`string`[]

Array of validation error messages

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

Reports whether the transaction already contains signature values.

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

true if the transaction has no validation errors

#### Implementation of

`TransactionInterface.isValid`

***

### raw()

> **raw**(): `AccessList2930TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-2930 transaction, in order.

Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
signatureYParity (v), signatureR (r), signatureS (s)]`

Use [AccessList2930Tx.serialize](#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [AccessList2930Tx.getMessageToSign](#getmessagetosign).

#### Returns

`AccessList2930TxValuesArray`

#### Implementation of

`TransactionInterface.raw`

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

#### Implementation of

`TransactionInterface.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `AccessList2930Tx`

Signs the transaction with the provided private key and returns a new instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy fed into the signing algorithm

#### Returns

`AccessList2930Tx`

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

Checks whether the signature currently attached to the transaction is valid.

#### Returns

`boolean`

true if signature verification succeeds

#### Implementation of

`TransactionInterface.verifySignature`
