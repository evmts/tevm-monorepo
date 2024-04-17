**@tevm/tx** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/tx](../README.md) / FeeMarketEIP1559Transaction

# Class: FeeMarketEIP1559Transaction

Typed transaction with a new gas fee market mechanism

- TransactionType: 2
- EIP: [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)

## Extends

- `BaseTransaction`\<[`FeeMarketEIP1559`](../enumerations/TransactionType.md#feemarketeip1559)\>

## Constructors

### new FeeMarketEIP1559Transaction(txData, opts)

> **new FeeMarketEIP1559Transaction**(`txData`, `opts`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

• **txData**: `FeeMarketEIP1559TxData`

• **opts?**: `TxOptions`

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Overrides

`BaseTransaction<TransactionType.FeeMarketEIP1559>.constructor`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:52

## Properties

### AccessListJSON

> **`readonly`** **AccessListJSON**: `AccessList`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:16

***

### \_type

> **`protected`** **`readonly`** **\_type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

`BaseTransaction._type`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:14

***

### accessList

> **`readonly`** **accessList**: `AccessListBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:15

***

### activeCapabilities

> **`protected`** **activeCapabilities**: `number`[]

List of tx type defining EIPs,
e.g. 1559 (fee market) and 2930 (access lists)
for FeeMarketEIP1559Transaction objects

#### Inherited from

`BaseTransaction.activeCapabilities`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:31

***

### cache

> **cache**: `TransactionCache`

#### Inherited from

`BaseTransaction.cache`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:24

***

### chainId

> **`readonly`** **chainId**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:14

***

### common

> **`readonly`** **common**: `Common`

#### Overrides

`BaseTransaction.common`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:19

***

### data

> **`readonly`** **data**: `Uint8Array`

#### Inherited from

`BaseTransaction.data`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:19

***

### gasLimit

> **`readonly`** **gasLimit**: `bigint`

#### Inherited from

`BaseTransaction.gasLimit`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:16

***

### maxFeePerGas

> **`readonly`** **maxFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:18

***

### maxPriorityFeePerGas

> **`readonly`** **maxPriorityFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:17

***

### nonce

> **`readonly`** **nonce**: `bigint`

#### Inherited from

`BaseTransaction.nonce`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:15

***

### r?

> **`optional`** **`readonly`** **r**: `bigint`

#### Inherited from

`BaseTransaction.r`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:21

***

### s?

> **`optional`** **`readonly`** **s**: `bigint`

#### Inherited from

`BaseTransaction.s`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:22

***

### to?

> **`optional`** **`readonly`** **to**: `Address`

#### Inherited from

`BaseTransaction.to`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:17

***

### txOptions

> **`protected`** **`readonly`** **txOptions**: `TxOptions`

#### Inherited from

`BaseTransaction.txOptions`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:25

***

### v?

> **`optional`** **`readonly`** **v**: `bigint`

#### Inherited from

`BaseTransaction.v`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:20

***

### value

> **`readonly`** **value**: `bigint`

#### Inherited from

`BaseTransaction.value`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:18

## Accessors

### type

> **`get`** **type**(): [`TransactionType`](../enumerations/TransactionType.md)

Returns the transaction type.

Note: legacy txs will return tx type `0`.

#### Returns

[`TransactionType`](../enumerations/TransactionType.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:47

## Methods

### \_getSharedErrorPostfix()

> **`protected`** **\_getSharedErrorPostfix**(): `string`

Returns the shared error postfix part for _error() method
tx type implementations.

#### Returns

`string`

#### Inherited from

`BaseTransaction._getSharedErrorPostfix`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:189

***

### \_validateCannotExceedMaxInteger()

> **`protected`** **\_validateCannotExceedMaxInteger**(`values`, `bits`?, `cannotEqual`?): `void`

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

`BaseTransaction._validateCannotExceedMaxInteger`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:168

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Parameters

• **v**: `bigint`

• **r**: `bigint` \| `Uint8Array`

• **s**: `bigint` \| `Uint8Array`

• **convertV?**: `boolean`

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Overrides

`BaseTransaction.addSignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:127

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Overrides

`BaseTransaction.errorStr`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:135

***

### getBaseFee()

> **getBaseFee**(): `bigint`

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

#### Returns

`bigint`

#### Inherited from

`BaseTransaction.getBaseFee`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:78

***

### getDataFee()

> **getDataFee**(): `bigint`

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Overrides

`BaseTransaction.getDataFee`

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

#### Overrides

`BaseTransaction.getEffectivePriorityFee`

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

#### Overrides

`BaseTransaction.getHashedMessageToSign`

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

#### Overrides

`BaseTransaction.getMessageToSign`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:103

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getMessageToVerifySignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:122

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Returns the sender's address

#### Returns

`Address`

#### Inherited from

`BaseTransaction.getSenderAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Returns the public key of the sender

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.getSenderPublicKey`

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

#### Overrides

`BaseTransaction.getUpfrontCost`

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

`BaseTransaction.getValidationErrors`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:69

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarketEIP1559Transaction.getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

#### Overrides

`BaseTransaction.hash`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:118

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.isSigned`

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

`BaseTransaction.isValid`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:74

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

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

`BaseTransaction.raw`

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

#### Overrides

`BaseTransaction.serialize`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:91

***

### sign()

> **sign**(`privateKey`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Signs a transaction.

Note that the signed tx is returned as a new object,
use as follows:
```javascript
const signedTx = tx.sign(privateKey)
```

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Inherited from

`BaseTransaction.sign`

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

`BaseTransaction.supports`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:64

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.toCreationAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:96

***

### toJSON()

> **toJSON**(): `JsonTx`

Returns an object with the JSON representation of the transaction

#### Returns

`JsonTx`

#### Overrides

`BaseTransaction.toJSON`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:131

***

### verifySignature()

> **verifySignature**(): `boolean`

Determines if the signature is valid

#### Returns

`boolean`

#### Inherited from

`BaseTransaction.verifySignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:120

***

### \_validateNotArray()

> **`static`** **`protected`** **\_validateNotArray**(`values`): `void`

#### Parameters

• **values**

#### Returns

`void`

#### Inherited from

`BaseTransaction._validateNotArray`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/baseTransaction.d.ts:171

***

### fromSerializedTx()

> **`static`** **fromSerializedTx**(`serialized`, `opts`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Instantiate a transaction from the serialized tx.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

#### Parameters

• **serialized**: `Uint8Array`

• **opts?**: `TxOptions`

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:37

***

### fromTxData()

> **`static`** **fromTxData**(`txData`, `opts`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Instantiate a transaction from a data dictionary.

Format: \{ chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, v, r, s \}

Notes:
- `chainId` will be set automatically if not provided
- All parameters are optional and have some basic default values

#### Parameters

• **txData**: `FeeMarketEIP1559TxData`

• **opts?**: `TxOptions`

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:30

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

Create a transaction from a values array.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS]`

#### Parameters

• **values**: `FeeMarketEIP1559TxValuesArray`

• **opts?**: `TxOptions`

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/eip1559Transaction.d.ts:44
