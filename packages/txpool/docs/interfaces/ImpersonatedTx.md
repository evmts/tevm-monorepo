[**@tevm/txpool**](../README.md)

***

[@tevm/txpool](../globals.md) / ImpersonatedTx

# Interface: ImpersonatedTx

Defined in: zevm/npm/zevm/dist/txpool.d.ts:3

## Extends

- `FeeMarket1559Tx`

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList` | `readonly` | `AccessListBytes` | - | `FeeMarketEIP1559Transaction.accessList` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:20 |
| <a id="activecapabilities"></a> `activeCapabilities` | `protected` | `number`[] | List of tx type defining EIPs, e.g. 1559 (fee market) and 2930 (access lists) for FeeMarket1559Tx objects | `FeeMarketEIP1559Transaction.activeCapabilities` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:35 |
| <a id="cache"></a> `cache` | `readonly` | `TransactionCache` | - | `FeeMarketEIP1559Transaction.cache` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:29 |
| <a id="chainid"></a> `chainId` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.chainId` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:21 |
| <a id="common"></a> `common` | `readonly` | `Common` | - | `FeeMarketEIP1559Transaction.common` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:27 |
| <a id="data"></a> `data` | `readonly` | `Uint8Array` | - | `FeeMarketEIP1559Transaction.data` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:18 |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.gasLimit` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:16 |
| <a id="isimpersonated"></a> `isImpersonated` | `public` | `true` | - | - | zevm/npm/zevm/dist/txpool.d.ts:4 |
| <a id="maxfeepergas"></a> `maxFeePerGas` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.maxFeePerGas` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:23 |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.maxPriorityFeePerGas` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:22 |
| <a id="nonce"></a> `nonce` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.nonce` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:15 |
| <a id="r"></a> `r?` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.r` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:25 |
| <a id="s"></a> `s?` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.s` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:26 |
| <a id="to"></a> `to?` | `readonly` | `Address` | - | `FeeMarketEIP1559Transaction.to` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:19 |
| <a id="txoptions"></a> `txOptions` | `readonly` | `TxOptions` | - | `FeeMarketEIP1559Transaction.txOptions` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:28 |
| <a id="type"></a> `type` | `public` | `2` | - | `FeeMarketEIP1559Transaction.type` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:14 |
| <a id="v"></a> `v?` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.v` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:24 |
| <a id="value"></a> `value` | `readonly` | `bigint` | - | `FeeMarketEIP1559Transaction.value` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:17 |

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `FeeMarket1559Tx`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:158

Adds signature values and returns a new EIP-1559 transaction instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `bigint` | Recovery parameter (y-parity) |
| `r` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | Signature `r` value |
| `s` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | Signature `s` value |

#### Returns

`FeeMarket1559Tx`

Newly created transaction that includes the signature

#### Inherited from

`FeeMarketEIP1559Transaction.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:199

Return a compact error string representation of the object

#### Returns

`string`

Human-readable error summary

#### Inherited from

`FeeMarketEIP1559Transaction.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:64

The amount of gas paid for the data in this tx

#### Returns

`bigint`

#### Inherited from

`FeeMarketEIP1559Transaction.getDataGas`

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:69

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseFee` | `bigint` | Base fee retrieved from block |

#### Returns

`bigint`

#### Inherited from

`FeeMarketEIP1559Transaction.getEffectivePriorityFee`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:132

Returns the hashed serialized unsigned tx, which can be used
to sign the transaction (e.g. for sending to a hardware wallet).

Note: in contrast to the legacy tx the raw message format is already
serialized and doesn't need to be RLP encoded any more.

#### Returns

`Uint8Array`

Keccak hash of the unsigned transaction payload

#### Inherited from

`FeeMarketEIP1559Transaction.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:81

The minimum gas limit which the tx to have to be valid.
This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
the optional creation fee (if the transaction creates a contract), and if relevant the gas
to be paid for access lists (EIP-2930) and authority lists (EIP-7702).

#### Returns

`bigint`

#### Inherited from

`FeeMarketEIP1559Transaction.getIntrinsicGas`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:123

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

`FeeMarketEIP1559Transaction.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:145

Computes a sha3-256 hash which can be used to verify the signature

#### Returns

`Uint8Array`

Hash used when verifying the signature

#### Inherited from

`FeeMarketEIP1559Transaction.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:182

Recovers the sender address from the signature.

#### Returns

`Address`

Sender Address

#### Inherited from

`FeeMarketEIP1559Transaction.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:150

Returns the public key of the sender

#### Returns

`Uint8Array`

Sender public key

#### Inherited from

`FeeMarketEIP1559Transaction.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee?`): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:74

The up front amount that an account must have for this transaction to be valid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseFee?` | `bigint` | The base fee of the block (will be set to 0 if not provided) |

#### Returns

`bigint`

#### Inherited from

`FeeMarketEIP1559Transaction.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:168

Runs validation logic and returns encountered errors, if any.

#### Returns

`string`[]

Array of validation error messages.

#### Inherited from

`FeeMarketEIP1559Transaction.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:140

Computes a sha3-256 hash of the serialized tx.

This method can only be used for signed txs (it throws otherwise).
Use [FeeMarket1559Tx.getMessageToSign](#getmessagetosign) to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Inherited from

`FeeMarketEIP1559Transaction.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:194

Reports whether the transaction already contains `v`, `r`, and `s`.

#### Returns

`boolean`

true if signature parts are present

#### Inherited from

`FeeMarketEIP1559Transaction.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:172

#### Returns

`boolean`

true if the transaction passes validation

#### Inherited from

`FeeMarketEIP1559Transaction.isValid`

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:99

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

#### Inherited from

`FeeMarketEIP1559Transaction.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:110

Returns the serialized encoding of the EIP-1559 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Inherited from

`FeeMarketEIP1559Transaction.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `FeeMarket1559Tx`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:189

Signs the transaction with the provided private key and returns the signed instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `privateKey` | `Uint8Array` | 32-byte private key |
| `extraEntropy?` | `boolean` \| `Uint8Array`\<`ArrayBufferLike`\> | Optional entropy passed to the signing routine |

#### Returns

`FeeMarket1559Tx`

Newly signed transaction

#### Inherited from

`FeeMarketEIP1559Transaction.sign`

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:60

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

| Parameter | Type |
| ------ | ------ |
| `capability` | `number` |

#### Returns

`boolean`

#### Inherited from

`FeeMarketEIP1559Transaction.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:85

If the tx's `to` is to the creation address

#### Returns

`boolean`

#### Inherited from

`FeeMarketEIP1559Transaction.toCreationAddress`

***

### toJSON()

> **toJSON**(): `JSONTx`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:163

Returns an object with the JSON representation of the transaction

#### Returns

`JSONTx`

JSON encoding of the transaction

#### Inherited from

`FeeMarketEIP1559Transaction.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/1559/tx.d.ts:177

Verifies the embedded signature.

#### Returns

`boolean`

true if signature verification succeeds

#### Inherited from

`FeeMarketEIP1559Transaction.verifySignature`
