[**@tevm/tx**](../README.md) • **Docs**

***

[@tevm/tx](../globals.md) / ImpersonatedTx

# Interface: ImpersonatedTx

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extends

- [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

## Properties

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`AccessListJSON`](../classes/FeeMarketEIP1559Transaction.md#accesslistjson)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:16

***

### \_type

> `protected` `readonly` **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`_type`](../classes/FeeMarketEIP1559Transaction.md#_type)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`accessList`](../classes/FeeMarketEIP1559Transaction.md#accesslist)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:15

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`activeCapabilities`](../classes/FeeMarketEIP1559Transaction.md#activecapabilities)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

***

### cache

> **cache**: `TransactionCache`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`cache`](../classes/FeeMarketEIP1559Transaction.md#cache)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`chainId`](../classes/FeeMarketEIP1559Transaction.md#chainid)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:14

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`common`](../classes/FeeMarketEIP1559Transaction.md#common)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:19

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`data`](../classes/FeeMarketEIP1559Transaction.md#data)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`gasLimit`](../classes/FeeMarketEIP1559Transaction.md#gaslimit)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

***

### isImpersonated

> **isImpersonated**: `true`

#### Source

[packages/tx/src/ImpersonatedTx.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.ts#L4)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`maxFeePerGas`](../classes/FeeMarketEIP1559Transaction.md#maxfeepergas)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:18

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`maxPriorityFeePerGas`](../classes/FeeMarketEIP1559Transaction.md#maxpriorityfeepergas)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:17

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`nonce`](../classes/FeeMarketEIP1559Transaction.md#nonce)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

***

### r?

> `optional` `readonly` **r**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`r`](../classes/FeeMarketEIP1559Transaction.md#r)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

***

### s?

> `optional` `readonly` **s**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`s`](../classes/FeeMarketEIP1559Transaction.md#s)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

***

### to?

> `optional` `readonly` **to**: `Address`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`to`](../classes/FeeMarketEIP1559Transaction.md#to)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

***

### txOptions

> `protected` `readonly` **txOptions**: [`TxOptions`](TxOptions.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`txOptions`](../classes/FeeMarketEIP1559Transaction.md#txoptions)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

***

### v?

> `optional` `readonly` **v**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`v`](../classes/FeeMarketEIP1559Transaction.md#v)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`value`](../classes/FeeMarketEIP1559Transaction.md#value)

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`_getSharedErrorPostfix`](../classes/FeeMarketEIP1559Transaction.md#_getsharederrorpostfix)

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`_validateCannotExceedMaxInteger`](../classes/FeeMarketEIP1559Transaction.md#_validatecannotexceedmaxinteger)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

#### Parameters

• **v**: `bigint`

• **r**: `bigint` \| `Uint8Array`

• **s**: `bigint` \| `Uint8Array`

• **convertV?**: `boolean`

#### Returns

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`addSignature`](../classes/FeeMarketEIP1559Transaction.md#addsignature)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:127

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`errorStr`](../classes/FeeMarketEIP1559Transaction.md#errorstr)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:135

***

### getBaseFee()

> **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getBaseFee`](../classes/FeeMarketEIP1559Transaction.md#getbasefee)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

***

### getDataFee()

> **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getDataFee`](../classes/FeeMarketEIP1559Transaction.md#getdatafee)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:56

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getEffectivePriorityFee`](../classes/FeeMarketEIP1559Transaction.md#geteffectivepriorityfee)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:61

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getHashedMessageToSign`](../classes/FeeMarketEIP1559Transaction.md#gethashedmessagetosign)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:111

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getMessageToSign`](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:103

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getMessageToVerifySignature`](../classes/FeeMarketEIP1559Transaction.md#getmessagetoverifysignature)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:122

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getSenderAddress`](../classes/FeeMarketEIP1559Transaction.md#getsenderaddress)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getSenderPublicKey`](../classes/FeeMarketEIP1559Transaction.md#getsenderpublickey)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:126

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getUpfrontCost`](../classes/FeeMarketEIP1559Transaction.md#getupfrontcost)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:66

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`getValidationErrors`](../classes/FeeMarketEIP1559Transaction.md#getvalidationerrors)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarketEIP1559Transaction.getMessageToSign](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`hash`](../classes/FeeMarketEIP1559Transaction.md#hash)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:118

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`isSigned`](../classes/FeeMarketEIP1559Transaction.md#issigned)

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`isValid`](../classes/FeeMarketEIP1559Transaction.md#isvalid)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarketEIP1559Transaction.serialize](../classes/FeeMarketEIP1559Transaction.md#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarketEIP1559Transaction.getMessageToSign](../classes/FeeMarketEIP1559Transaction.md#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`raw`](../classes/FeeMarketEIP1559Transaction.md#raw)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:80

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

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:91

***

### sign()

> **sign**(`privateKey`): [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`sign`](../classes/FeeMarketEIP1559Transaction.md#sign)

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

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`supports`](../classes/FeeMarketEIP1559Transaction.md#supports)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`toCreationAddress`](../classes/FeeMarketEIP1559Transaction.md#tocreationaddress)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Returns an object with the JSON representation of the transaction

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`toJSON`](../classes/FeeMarketEIP1559Transaction.md#tojson)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:131

***

### verifySignature()

> **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md).[`verifySignature`](../classes/FeeMarketEIP1559Transaction.md#verifysignature)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120
