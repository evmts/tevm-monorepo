---
editUrl: false
next: false
prev: false
title: "ImpersonatedTx"
---

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extends

- [`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/)

## Properties

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](/reference/tevm/tx/type-aliases/accesslist/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`AccessListJSON`](/reference/tevm/tx/classes/feemarketeip1559transaction/#accesslistjson)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:16

***

### \_type

> `protected` `readonly` **\_type**: [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`_type`](/reference/tevm/tx/classes/feemarketeip1559transaction/#_type)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`accessList`](/reference/tevm/tx/classes/feemarketeip1559transaction/#accesslist)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:15

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`activeCapabilities`](/reference/tevm/tx/classes/feemarketeip1559transaction/#activecapabilities)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

***

### cache

> **cache**: `TransactionCache`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`cache`](/reference/tevm/tx/classes/feemarketeip1559transaction/#cache)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`chainId`](/reference/tevm/tx/classes/feemarketeip1559transaction/#chainid)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:14

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`common`](/reference/tevm/tx/classes/feemarketeip1559transaction/#common)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:19

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`data`](/reference/tevm/tx/classes/feemarketeip1559transaction/#data)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`gasLimit`](/reference/tevm/tx/classes/feemarketeip1559transaction/#gaslimit)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

***

### isImpersonated

> **isImpersonated**: `true`

#### Defined in

[packages/tx/src/ImpersonatedTx.ts:4](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.ts#L4)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`maxFeePerGas`](/reference/tevm/tx/classes/feemarketeip1559transaction/#maxfeepergas)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:18

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`maxPriorityFeePerGas`](/reference/tevm/tx/classes/feemarketeip1559transaction/#maxpriorityfeepergas)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:17

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`nonce`](/reference/tevm/tx/classes/feemarketeip1559transaction/#nonce)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

***

### r?

> `readonly` `optional` **r**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`r`](/reference/tevm/tx/classes/feemarketeip1559transaction/#r)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

***

### s?

> `readonly` `optional` **s**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`s`](/reference/tevm/tx/classes/feemarketeip1559transaction/#s)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`to`](/reference/tevm/tx/classes/feemarketeip1559transaction/#to)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

***

### txOptions

> `protected` `readonly` **txOptions**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`txOptions`](/reference/tevm/tx/classes/feemarketeip1559transaction/#txoptions)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

***

### v?

> `readonly` `optional` **v**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`v`](/reference/tevm/tx/classes/feemarketeip1559transaction/#v)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`value`](/reference/tevm/tx/classes/feemarketeip1559transaction/#value)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

> `get` **type**(): [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

[`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`type`](/reference/tevm/tx/classes/feemarketeip1559transaction/#type)

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

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`_getSharedErrorPostfix`](/reference/tevm/tx/classes/feemarketeip1559transaction/#_getsharederrorpostfix)

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

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`_validateCannotExceedMaxInteger`](/reference/tevm/tx/classes/feemarketeip1559transaction/#_validatecannotexceedmaxinteger)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/)

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

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`addSignature`](/reference/tevm/tx/classes/feemarketeip1559transaction/#addsignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:127

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`errorStr`](/reference/tevm/tx/classes/feemarketeip1559transaction/#errorstr)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:135

***

### getBaseFee()

> **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getBaseFee`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getbasefee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

***

### getDataFee()

> **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getDataFee`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getdatafee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:56

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

• **baseFee**: `bigint`

Base fee retrieved from block

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getEffectivePriorityFee`](/reference/tevm/tx/classes/feemarketeip1559transaction/#geteffectivepriorityfee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:61

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getHashedMessageToSign`](/reference/tevm/tx/classes/feemarketeip1559transaction/#gethashedmessagetosign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:111

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

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getMessageToSign`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getmessagetosign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:103

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getMessageToVerifySignature`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getmessagetoverifysignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:122

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Returns the sender's address

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getSenderAddress`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getsenderaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getSenderPublicKey`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getsenderpublickey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:126

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`?): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

• **baseFee?**: `bigint`

The base fee of the block (will be set to 0 if not provided)

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getUpfrontCost`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getupfrontcost)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:66

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`getValidationErrors`](/reference/tevm/tx/classes/feemarketeip1559transaction/#getvalidationerrors)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarketEIP1559Transaction.getMessageToSign](../../../../../../../../reference/tevm/tx/classes/feemarketeip1559transaction/#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`hash`](/reference/tevm/tx/classes/feemarketeip1559transaction/#hash)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:118

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`isSigned`](/reference/tevm/tx/classes/feemarketeip1559transaction/#issigned)

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

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`isValid`](/reference/tevm/tx/classes/feemarketeip1559transaction/#isvalid)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarketEIP1559Transaction.serialize](../../../../../../../../reference/tevm/tx/classes/feemarketeip1559transaction/#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarketEIP1559Transaction.getMessageToSign](../../../../../../../../reference/tevm/tx/classes/feemarketeip1559transaction/#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`raw`](/reference/tevm/tx/classes/feemarketeip1559transaction/#raw)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:80

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

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`serialize`](/reference/tevm/tx/classes/feemarketeip1559transaction/#serialize)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:91

***

### sign()

> **sign**(`privateKey`): [`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`sign`](/reference/tevm/tx/classes/feemarketeip1559transaction/#sign)

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

• **capability**: [`Capability`](/reference/tevm/tx/enumerations/capability/)

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`supports`](/reference/tevm/tx/classes/feemarketeip1559transaction/#supports)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`toCreationAddress`](/reference/tevm/tx/classes/feemarketeip1559transaction/#tocreationaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

***

### toJSON()

> **toJSON**(): [`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`toJSON`](/reference/tevm/tx/classes/feemarketeip1559transaction/#tojson)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:131

***

### verifySignature()

> **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/).[`verifySignature`](/reference/tevm/tx/classes/feemarketeip1559transaction/#verifysignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120
