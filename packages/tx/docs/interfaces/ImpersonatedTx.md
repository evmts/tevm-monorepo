[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / ImpersonatedTx

# Interface: ImpersonatedTx

Defined in: [packages/tx/src/ImpersonatedTx.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.ts#L3)

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extends

- [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:20

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`accessList`](../classes/FeeMarketEIP1559Transaction.md#accesslist)

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:35

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`activeCapabilities`](../classes/FeeMarketEIP1559Transaction.md#activecapabilities)

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:29

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`cache`](../classes/FeeMarketEIP1559Transaction.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:21

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`chainId`](../classes/FeeMarketEIP1559Transaction.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:27

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`common`](../classes/FeeMarketEIP1559Transaction.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:18

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`data`](../classes/FeeMarketEIP1559Transaction.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:16

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`gasLimit`](../classes/FeeMarketEIP1559Transaction.md#gaslimit)

***

### isImpersonated

> **isImpersonated**: `true`

Defined in: [packages/tx/src/ImpersonatedTx.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.ts#L4)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:23

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`maxFeePerGas`](../classes/FeeMarketEIP1559Transaction.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:22

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`maxPriorityFeePerGas`](../classes/FeeMarketEIP1559Transaction.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:15

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`nonce`](../classes/FeeMarketEIP1559Transaction.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:25

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`r`](../classes/FeeMarketEIP1559Transaction.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:26

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`s`](../classes/FeeMarketEIP1559Transaction.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:19

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`to`](../classes/FeeMarketEIP1559Transaction.md#to)

***

### txOptions

> `readonly` **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:28

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`txOptions`](../classes/FeeMarketEIP1559Transaction.md#txoptions)

***

### type

> **type**: `2`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:14

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`type`](../classes/FeeMarketEIP1559Transaction.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:24

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`v`](../classes/FeeMarketEIP1559Transaction.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:17

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`value`](../classes/FeeMarketEIP1559Transaction.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:146

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`addSignature`](../classes/FeeMarketEIP1559Transaction.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:160

Return a compact error string representation of the object

#### Returns

`string`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`errorStr`](../classes/FeeMarketEIP1559Transaction.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:64

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getDataGas`](../classes/FeeMarketEIP1559Transaction.md#getdatagas)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getEffectivePriorityFee`](../classes/FeeMarketEIP1559Transaction.md#geteffectivepriorityfee)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getHashedMessageToSign`](../classes/FeeMarketEIP1559Transaction.md#gethashedmessagetosign)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getIntrinsicGas`](../classes/FeeMarketEIP1559Transaction.md#getintrinsicgas)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getMessageToSign`](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:141

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getMessageToVerifySignature`](../classes/FeeMarketEIP1559Transaction.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:154

#### Returns

`Address`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getSenderAddress`](../classes/FeeMarketEIP1559Transaction.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:145

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getSenderPublicKey`](../classes/FeeMarketEIP1559Transaction.md#getsenderpublickey)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getUpfrontCost`](../classes/FeeMarketEIP1559Transaction.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:151

#### Returns

`string`[]

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getValidationErrors`](../classes/FeeMarketEIP1559Transaction.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:137

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`hash`](../classes/FeeMarketEIP1559Transaction.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:156

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`isSigned`](../classes/FeeMarketEIP1559Transaction.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:152

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`isValid`](../classes/FeeMarketEIP1559Transaction.md#isvalid)

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:99

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:110

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:155

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`sign`](../classes/FeeMarketEIP1559Transaction.md#sign)

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`supports`](../classes/FeeMarketEIP1559Transaction.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:85

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`toCreationAddress`](../classes/FeeMarketEIP1559Transaction.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:150

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`toJSON`](../classes/FeeMarketEIP1559Transaction.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:153

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`verifySignature`](../classes/FeeMarketEIP1559Transaction.md#verifysignature)
