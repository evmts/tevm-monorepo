[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / ImpersonatedTx

# Interface: ImpersonatedTx

Defined in: zevm/npm/zevm/dist/tx.d.ts:5

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extends

- [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`accessList`](../classes/FeeMarketEIP1559Transaction.md#accesslist)

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`activeCapabilities`](../classes/FeeMarketEIP1559Transaction.md#activecapabilities)

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`cache`](../classes/FeeMarketEIP1559Transaction.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`chainId`](../classes/FeeMarketEIP1559Transaction.md#chainid)

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`common`](../classes/FeeMarketEIP1559Transaction.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`data`](../classes/FeeMarketEIP1559Transaction.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`gasLimit`](../classes/FeeMarketEIP1559Transaction.md#gaslimit)

***

### isImpersonated

> **isImpersonated**: `true`

Defined in: zevm/npm/zevm/dist/tx.d.ts:6

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`maxFeePerGas`](../classes/FeeMarketEIP1559Transaction.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`maxPriorityFeePerGas`](../classes/FeeMarketEIP1559Transaction.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`nonce`](../classes/FeeMarketEIP1559Transaction.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`r`](../classes/FeeMarketEIP1559Transaction.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`s`](../classes/FeeMarketEIP1559Transaction.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`to`](../classes/FeeMarketEIP1559Transaction.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](TxOptions.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`txOptions`](../classes/FeeMarketEIP1559Transaction.md#txoptions)

***

### type

> **type**: `2`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`type`](../classes/FeeMarketEIP1559Transaction.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`v`](../classes/FeeMarketEIP1559Transaction.md#v)

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`value`](../classes/FeeMarketEIP1559Transaction.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

Newly created transaction that includes the signature

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`addSignature`](../classes/FeeMarketEIP1559Transaction.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

Human-readable error summary

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`errorStr`](../classes/FeeMarketEIP1559Transaction.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getDataGas`](../classes/FeeMarketEIP1559Transaction.md#getdatagas)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getEffectivePriorityFee`](../classes/FeeMarketEIP1559Transaction.md#geteffectivepriorityfee)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getHashedMessageToSign`](../classes/FeeMarketEIP1559Transaction.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

The minimum gas limit which the tx to have to be valid.
This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
the optional creation fee (if the transaction creates a contract), and if relevant the gas
to be paid for access lists (EIP-2930) and authority lists (EIP-7702).

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getIntrinsicGas`](../classes/FeeMarketEIP1559Transaction.md#getintrinsicgas)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getMessageToSign`](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

Hash used when verifying the signature

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getMessageToVerifySignature`](../classes/FeeMarketEIP1559Transaction.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Recovers the sender address from the signature.

#### Returns

`Address`

Sender Address

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getSenderAddress`](../classes/FeeMarketEIP1559Transaction.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getSenderPublicKey`](../classes/FeeMarketEIP1559Transaction.md#getsenderpublickey)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getUpfrontCost`](../classes/FeeMarketEIP1559Transaction.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Runs validation logic and returns encountered errors, if any.

#### Returns

`string`[]

Array of validation error messages.

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getValidationErrors`](../classes/FeeMarketEIP1559Transaction.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`hash`](../classes/FeeMarketEIP1559Transaction.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Reports whether the transaction already contains `v`, `r`, and `s`.

#### Returns

`boolean`

true if signature parts are present

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`isSigned`](../classes/FeeMarketEIP1559Transaction.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

true if the transaction passes validation

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`isValid`](../classes/FeeMarketEIP1559Transaction.md#isvalid)

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarket1559Tx.serialize](../classes/FeeMarketEIP1559Transaction.md#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarket1559Tx.getMessageToSign](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`raw`](../classes/FeeMarketEIP1559Transaction.md#raw)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`serialize`](../classes/FeeMarketEIP1559Transaction.md#serialize)

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

Signs the transaction with the provided private key and returns the signed instance.

#### Parameters

##### privateKey

`Uint8Array`

32-byte private key

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

Optional entropy passed to the signing routine

#### Returns

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

Newly signed transaction

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`sign`](../classes/FeeMarketEIP1559Transaction.md#sign)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`supports`](../classes/FeeMarketEIP1559Transaction.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`toCreationAddress`](../classes/FeeMarketEIP1559Transaction.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](JsonTx.md)

JSON encoding of the transaction

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`toJSON`](../classes/FeeMarketEIP1559Transaction.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Verifies the embedded signature.

#### Returns

`boolean`

true if signature verification succeeds

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`verifySignature`](../classes/FeeMarketEIP1559Transaction.md#verifysignature)
