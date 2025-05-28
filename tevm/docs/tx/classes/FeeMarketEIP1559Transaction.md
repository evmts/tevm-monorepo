[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / FeeMarketEIP1559Transaction

# Class: FeeMarketEIP1559Transaction

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:13

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:43

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:20

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:35

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:29

#### Implementation of

`TransactionInterface.cache`

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:21

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:27

#### Implementation of

`TransactionInterface.common`

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:18

#### Implementation of

`TransactionInterface.data`

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:16

#### Implementation of

`TransactionInterface.gasLimit`

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:23

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:22

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:15

#### Implementation of

`TransactionInterface.nonce`

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:25

#### Implementation of

`TransactionInterface.r`

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:26

#### Implementation of

`TransactionInterface.s`

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:19

#### Implementation of

`TransactionInterface.to`

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](../interfaces/TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:28

#### Implementation of

`TransactionInterface.txOptions`

***

### type

> **type**: `2`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:14

#### Implementation of

`TransactionInterface.type`

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:24

#### Implementation of

`TransactionInterface.v`

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:17

#### Implementation of

`TransactionInterface.value`

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `FeeMarket1559Tx`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:146

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`FeeMarket1559Tx`

#### Implementation of

`TransactionInterface.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:160

Return a compact error string representation of the object

#### Returns

`string`

#### Implementation of

`TransactionInterface.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:64

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getDataGas`

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:69

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:130

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:81

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:122

Returns the raw serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

```javascript
const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
```

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:141

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:154

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Implementation of

`TransactionInterface.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:145

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee?`): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:74

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:151

#### Returns

`string`[]

#### Implementation of

`TransactionInterface.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:137

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:156

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:152

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.isValid`

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:99

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:110

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:155

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`FeeMarket1559Tx`

#### Implementation of

`TransactionInterface.sign`

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:60

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:85

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:150

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](../interfaces/JsonTx.md)

#### Implementation of

`TransactionInterface.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:153

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.verifySignature`
