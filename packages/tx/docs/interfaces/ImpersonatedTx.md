[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / ImpersonatedTx

# Interface: ImpersonatedTx

Defined in: [packages/tx/src/ImpersonatedTx.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.ts#L3)

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extends

- [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

## Properties

### \_type

> `protected` `readonly` **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:13

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`_type`](../classes/FeeMarket1559Tx.md#_type)

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:15

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`accessList`](../classes/FeeMarket1559Tx.md#accesslist)

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:16

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`AccessListJSON`](../classes/FeeMarket1559Tx.md#accesslistjson)

***

### activeCapabilities

> `protected` **activeCapabilities**: `number`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:30

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarket1559Tx objects

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`activeCapabilities`](../classes/FeeMarket1559Tx.md#activecapabilities)

***

### cache

> **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:23

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`cache`](../classes/FeeMarket1559Tx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:14

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`chainId`](../classes/FeeMarket1559Tx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:19

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`common`](../classes/FeeMarket1559Tx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`data`](../classes/FeeMarket1559Tx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`gasLimit`](../classes/FeeMarket1559Tx.md#gaslimit)

***

### isImpersonated

> **isImpersonated**: `true`

Defined in: [packages/tx/src/ImpersonatedTx.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.ts#L4)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:18

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`maxFeePerGas`](../classes/FeeMarket1559Tx.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:17

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`maxPriorityFeePerGas`](../classes/FeeMarket1559Tx.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`nonce`](../classes/FeeMarket1559Tx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`r`](../classes/FeeMarket1559Tx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`s`](../classes/FeeMarket1559Tx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`to`](../classes/FeeMarket1559Tx.md#to)

***

### txOptions

> `protected` `readonly` **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`txOptions`](../classes/FeeMarket1559Tx.md#txoptions)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`v`](../classes/FeeMarket1559Tx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`value`](../classes/FeeMarket1559Tx.md#value)

## Accessors

### type

#### Get Signature

> **get** **type**(): [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:46

Returns the transaction type.

Note: legacy txs will return tx type `0`.

##### Returns

[`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`type`](../classes/FeeMarket1559Tx.md#type)

## Methods

### \_getSharedErrorPostfix()

> `protected` **\_getSharedErrorPostfix**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:179

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`_getSharedErrorPostfix`](../classes/FeeMarket1559Tx.md#_getsharederrorpostfix)

***

### \_validateCannotExceedMaxInteger()

> `protected` **\_validateCannotExceedMaxInteger**(`values`, `bits`?, `cannotEqual`?): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:161

Validates that an object with BigInt values cannot exceed the specified bit limit.

#### Parameters

##### values

Object containing string keys and BigInt values

##### bits?

`number`

Number of bits to check (64 or 256)

##### cannotEqual?

`boolean`

Pass true if the number also cannot equal one less the maximum value

#### Returns

`void`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`_validateCannotExceedMaxInteger`](../classes/FeeMarket1559Tx.md#_validatecannotexceedmaxinteger)

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:102

Returns a new transaction with the same data fields as the current, but now signed

#### Parameters

##### v

`bigint`

The `v` value of the signature

##### r

The `r` value of the signature

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

The `s` value of the signature

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

Set this to `true` if the raw output of `ecsign` is used. If this is `false` (default)
                then the raw value passed for `v` will be used for the signature. For legacy transactions,
                if this is set to `true`, it will also set the right `v` value for the chain id.

#### Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`addSignature`](../classes/FeeMarket1559Tx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:110

Return a compact error string representation of the object

#### Returns

`string`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`errorStr`](../classes/FeeMarket1559Tx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:31

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getDataGas`](../classes/FeeMarket1559Tx.md#getdatagas)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:36

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

##### baseFee

`bigint`

Base fee retrieved from block

#### Returns

`bigint`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getEffectivePriorityFee`](../classes/FeeMarket1559Tx.md#geteffectivepriorityfee)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:86

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getHashedMessageToSign`](../classes/FeeMarket1559Tx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:80

The minimum gas limit which the tx to have to be valid.
This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
the optional creation fee (if the transaction creates a contract), and if relevant the gas
to be paid for access lists (EIP-2930) and authority lists (EIP-7702).

#### Returns

`bigint`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getIntrinsicGas`](../classes/FeeMarket1559Tx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:78

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

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getMessageToSign`](../classes/FeeMarket1559Tx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:97

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getMessageToVerifySignature`](../classes/FeeMarket1559Tx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:126

Returns the sender's address

#### Returns

`Address`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getSenderAddress`](../classes/FeeMarket1559Tx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:101

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getSenderPublicKey`](../classes/FeeMarket1559Tx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`?): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:41

The up front amount that an account must have for this transaction to be valid

#### Parameters

##### baseFee?

`bigint`

The base fee of the block (will be set to 0 if not provided)

#### Returns

`bigint`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getUpfrontCost`](../classes/FeeMarket1559Tx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:68

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`getValidationErrors`](../classes/FeeMarket1559Tx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:93

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](../classes/FeeMarket1559Tx.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`hash`](../classes/FeeMarket1559Tx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:118

#### Returns

`boolean`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`isSigned`](../classes/FeeMarket1559Tx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:73

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`isValid`](../classes/FeeMarket1559Tx.md#isvalid)

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:55

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarket1559Tx.serialize](../classes/FeeMarket1559Tx.md#serialize) to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarket1559Tx.getMessageToSign](../classes/FeeMarket1559Tx.md#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`raw`](../classes/FeeMarket1559Tx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:66

Returns the serialized encoding of the EIP-1559 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`serialize`](../classes/FeeMarket1559Tx.md#serialize)

***

### sign()

> **sign**(`privateKey`): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:140

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md)

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`sign`](../classes/FeeMarket1559Tx.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:63

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

[`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`supports`](../classes/FeeMarket1559Tx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:98

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`toCreationAddress`](../classes/FeeMarket1559Tx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:106

Returns an object with the JSON representation of the transaction

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`toJSON`](../classes/FeeMarket1559Tx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:122

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md).[`verifySignature`](../classes/FeeMarket1559Tx.md#verifysignature)
