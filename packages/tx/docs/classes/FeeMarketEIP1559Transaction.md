[@tevm/tx](../README.md) / [Exports](../modules.md) / FeeMarketEIP1559Transaction

# Class: FeeMarketEIP1559Transaction

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Hierarchy

- `BaseTransaction`\<`TransactionType.FeeMarketEIP1559`\>

  ↳ **`FeeMarketEIP1559Transaction`**

## Table of contents

### Constructors

- [constructor](FeeMarketEIP1559Transaction.md#constructor)

### Properties

- [AccessListJSON](FeeMarketEIP1559Transaction.md#accesslistjson)
- [\_type](FeeMarketEIP1559Transaction.md#_type)
- [accessList](FeeMarketEIP1559Transaction.md#accesslist)
- [activeCapabilities](FeeMarketEIP1559Transaction.md#activecapabilities)
- [cache](FeeMarketEIP1559Transaction.md#cache)
- [chainId](FeeMarketEIP1559Transaction.md#chainid)
- [common](FeeMarketEIP1559Transaction.md#common)
- [data](FeeMarketEIP1559Transaction.md#data)
- [gasLimit](FeeMarketEIP1559Transaction.md#gaslimit)
- [maxFeePerGas](FeeMarketEIP1559Transaction.md#maxfeepergas)
- [maxPriorityFeePerGas](FeeMarketEIP1559Transaction.md#maxpriorityfeepergas)
- [nonce](FeeMarketEIP1559Transaction.md#nonce)
- [r](FeeMarketEIP1559Transaction.md#r)
- [s](FeeMarketEIP1559Transaction.md#s)
- [to](FeeMarketEIP1559Transaction.md#to)
- [txOptions](FeeMarketEIP1559Transaction.md#txoptions)
- [v](FeeMarketEIP1559Transaction.md#v)
- [value](FeeMarketEIP1559Transaction.md#value)

### Accessors

- [type](FeeMarketEIP1559Transaction.md#type)

### Methods

- [\_getSharedErrorPostfix](FeeMarketEIP1559Transaction.md#_getsharederrorpostfix)
- [\_validateCannotExceedMaxInteger](FeeMarketEIP1559Transaction.md#_validatecannotexceedmaxinteger)
- [addSignature](FeeMarketEIP1559Transaction.md#addsignature)
- [errorStr](FeeMarketEIP1559Transaction.md#errorstr)
- [getBaseFee](FeeMarketEIP1559Transaction.md#getbasefee)
- [getDataFee](FeeMarketEIP1559Transaction.md#getdatafee)
- [getEffectivePriorityFee](FeeMarketEIP1559Transaction.md#geteffectivepriorityfee)
- [getHashedMessageToSign](FeeMarketEIP1559Transaction.md#gethashedmessagetosign)
- [getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign)
- [getMessageToVerifySignature](FeeMarketEIP1559Transaction.md#getmessagetoverifysignature)
- [getSenderAddress](FeeMarketEIP1559Transaction.md#getsenderaddress)
- [getSenderPublicKey](FeeMarketEIP1559Transaction.md#getsenderpublickey)
- [getUpfrontCost](FeeMarketEIP1559Transaction.md#getupfrontcost)
- [getValidationErrors](FeeMarketEIP1559Transaction.md#getvalidationerrors)
- [hash](FeeMarketEIP1559Transaction.md#hash)
- [isSigned](FeeMarketEIP1559Transaction.md#issigned)
- [isValid](FeeMarketEIP1559Transaction.md#isvalid)
- [raw](FeeMarketEIP1559Transaction.md#raw)
- [serialize](FeeMarketEIP1559Transaction.md#serialize)
- [sign](FeeMarketEIP1559Transaction.md#sign)
- [supports](FeeMarketEIP1559Transaction.md#supports)
- [toCreationAddress](FeeMarketEIP1559Transaction.md#tocreationaddress)
- [toJSON](FeeMarketEIP1559Transaction.md#tojson)
- [verifySignature](FeeMarketEIP1559Transaction.md#verifysignature)
- [\_validateNotArray](FeeMarketEIP1559Transaction.md#_validatenotarray)
- [fromSerializedTx](FeeMarketEIP1559Transaction.md#fromserializedtx)
- [fromTxData](FeeMarketEIP1559Transaction.md#fromtxdata)
- [fromValuesArray](FeeMarketEIP1559Transaction.md#fromvaluesarray)

## Constructors

### constructor

• **new FeeMarketEIP1559Transaction**(`txData`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `FeeMarketEIP1559TxData` |
| `opts?` | `TxOptions` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Overrides

BaseTransaction\&lt;TransactionType.FeeMarketEIP1559\&gt;.constructor

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:52

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: `AccessList`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:16

___

### \_type

• `Protected` `Readonly` **\_type**: `TransactionType`

#### Inherited from

BaseTransaction.\_type

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

___

### accessList

• `Readonly` **accessList**: `AccessListBytes`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:15

___

### activeCapabilities

• `Protected` **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

BaseTransaction.activeCapabilities

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

___

### cache

• **cache**: `TransactionCache`

#### Inherited from

BaseTransaction.cache

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:14

___

### common

• `Readonly` **common**: `Common`

#### Overrides

BaseTransaction.common

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:19

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

BaseTransaction.data

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

BaseTransaction.gasLimit

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

___

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:18

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:17

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

BaseTransaction.nonce

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

BaseTransaction.r

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

BaseTransaction.s

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

BaseTransaction.to

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

___

### txOptions

• `Protected` `Readonly` **txOptions**: `TxOptions`

#### Inherited from

BaseTransaction.txOptions

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

BaseTransaction.v

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

BaseTransaction.value

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

• `get` **type**(): `TransactionType`

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

`TransactionType`

#### Inherited from

BaseTransaction.type

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

## Methods

### \_getSharedErrorPostfix

▸ **_getSharedErrorPostfix**(): `string`

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

BaseTransaction.\_getSharedErrorPostfix

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

___

### \_validateCannotExceedMaxInteger

▸ **_validateCannotExceedMaxInteger**(`values`, `bits?`, `cannotEqual?`): `void`

Validates that an object with BigInt values cannot exceed the specified bit limit.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Object` | Object containing string keys and BigInt values |
| `bits?` | `number` | Number of bits to check (64 or 256) |
| `cannotEqual?` | `boolean` | Pass true if the number also cannot equal one less the maximum value |

#### Returns

`void`

#### Inherited from

BaseTransaction.\_validateCannotExceedMaxInteger

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

___

### addSignature

▸ **addSignature**(`v`, `r`, `s`, `convertV?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `bigint` \| `Uint8Array` |
| `s` | `bigint` \| `Uint8Array` |
| `convertV?` | `boolean` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Overrides

BaseTransaction.addSignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:127

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

BaseTransaction.errorStr

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:135

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

BaseTransaction.getBaseFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

___

### getDataFee

▸ **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

BaseTransaction.getDataFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:56

___

### getEffectivePriorityFee

▸ **getEffectivePriorityFee**(`baseFee`): `bigint`

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFee` | `bigint` | Base fee retrieved from block |

#### Returns

`bigint`

#### Overrides

BaseTransaction.getEffectivePriorityFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:61

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getHashedMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:111

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

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

BaseTransaction.getMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:103

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getMessageToVerifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:122

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

BaseTransaction.getSenderAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.getSenderPublicKey

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:126

___

### getUpfrontCost

▸ **getUpfrontCost**(`baseFee?`): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFee?` | `bigint` | The base fee of the block (will be set to 0 if not provided) |

#### Returns

`bigint`

#### Overrides

BaseTransaction.getUpfrontCost

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:66

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

Validates the transaction signature and minimum gas requirements.

#### Returns

`string`[]

an array of error strings

#### Inherited from

BaseTransaction.getValidationErrors

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

___

### hash

▸ **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarketEIP1559Transaction.getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.hash

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:118

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

BaseTransaction.isSigned

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:116

___

### isValid

▸ **isValid**(): `boolean`

Validates the transaction signature and minimum gas requirements.

#### Returns

`boolean`

true if the transaction is valid, false otherwise

#### Inherited from

BaseTransaction.isValid

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

___

### raw

▸ **raw**(): `FeeMarketEIP1559TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-1559 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

Use [FeeMarketEIP1559Transaction.serialize](FeeMarketEIP1559Transaction.md#serialize) to add a transaction to a block
with Block.fromValuesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use [FeeMarketEIP1559Transaction.getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign).

#### Returns

`FeeMarketEIP1559TxValuesArray`

#### Overrides

BaseTransaction.raw

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:80

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-1559 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Overrides

BaseTransaction.serialize

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:91

___

### sign

▸ **sign**(`privateKey`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Inherited from

BaseTransaction.sign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:138

___

### supports

▸ **supports**(`capability`): `boolean`

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

| Name | Type |
| :------ | :------ |
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

BaseTransaction.supports

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

BaseTransaction.toCreationAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

___

### toJSON

▸ **toJSON**(): `JsonTx`

Returns an object with the JSON representation of the transaction

#### Returns

`JsonTx`

#### Overrides

BaseTransaction.toJSON

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:131

___

### verifySignature

▸ **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

BaseTransaction.verifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

___

### \_validateNotArray

▸ **_validateNotArray**(`values`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Object` |

#### Returns

`void`

#### Inherited from

BaseTransaction.\_validateNotArray

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

___

### fromSerializedTx

▸ **fromSerializedTx**(`serialized`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Uint8Array` |
| `opts?` | `TxOptions` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:37

___

### fromTxData

▸ **fromTxData**(`txData`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Instantiate a transaction from a data dictionary.

Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s }

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `FeeMarketEIP1559TxData` |
| `opts?` | `TxOptions` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:30

___

### fromValuesArray

▸ **fromValuesArray**(`values`, `opts?`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `FeeMarketEIP1559TxValuesArray` |
| `opts?` | `TxOptions` |

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:44
