[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EOACodeEIP7702Transaction

# Class: EOACodeEIP7702Transaction

Typed transaction with the ability to set codes on EOA accounts

- TransactionType: 4
- EIP: [EIP-7702](https://github.com/ethereum/EIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/EIPS/eip-7702.md)

## Implements

- `TransactionInterface`\<*typeof* [`EOACodeEIP7702`](../variables/TransactionType.md#eoacodeeip7702)\>

## Constructors

### Constructor

> **new EOACodeEIP7702Transaction**(`txData`, `opts?`): `EOACode7702Tx`

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `txData` | [`EOACodeEIP7702TxData`](../interfaces/EOACodeEIP7702TxData.md) |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) |

#### Returns

`EOACode7702Tx`

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList` | `readonly` | `AccessListBytes` | - |
| <a id="activecapabilities"></a> `activeCapabilities` | `protected` | `number`[] | List of tx type defining EIPs, e.g. 1559 (fee market) and 2930 (access lists) for FeeMarket1559Tx objects |
| <a id="authorizationlist"></a> `authorizationList` | `readonly` | `EOACode7702AuthorizationListBytes` | - |
| <a id="cache"></a> `cache` | `readonly` | `TransactionCache` | - |
| <a id="chainid"></a> `chainId` | `readonly` | `bigint` | - |
| <a id="common"></a> `common` | `readonly` | `Common` | - |
| <a id="data"></a> `data` | `readonly` | `Uint8Array` | - |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | - |
| <a id="maxfeepergas"></a> `maxFeePerGas` | `readonly` | `bigint` | - |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas` | `readonly` | `bigint` | - |
| <a id="nonce"></a> `nonce` | `readonly` | `bigint` | - |
| <a id="r"></a> `r?` | `readonly` | `bigint` | - |
| <a id="s"></a> `s?` | `readonly` | `bigint` | - |
| <a id="to"></a> `to?` | `readonly` | `Address` | - |
| <a id="txoptions"></a> `txOptions` | `readonly` | [`TxOptions`](../interfaces/TxOptions.md) | - |
| <a id="type"></a> `type` | `public` | `4` | - |
| <a id="v"></a> `v?` | `readonly` | `bigint` | - |
| <a id="value"></a> `value` | `readonly` | `bigint` | - |

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`): `EOACode7702Tx`

Adds the provided signature values and returns a new transaction instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `v` | `bigint` | Recovery parameter |
| `r` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | Signature `r` value |
| `s` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | Signature `s` value |

#### Returns

`EOACode7702Tx`

New `EOACode7702Tx` that includes the signature

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

> **getEffectivePriorityFee**(`baseFee`): `bigint`

Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseFee` | `bigint` | Base fee retrieved from block |

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

Returns the recovered sender address.

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

> **getUpfrontCost**(`baseFee?`): `bigint`

The up front amount that an account must have for this transaction to be valid

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseFee?` | `bigint` | The base fee of the block (will be set to 0 if not provided) |

#### Returns

`bigint`

#### Implementation of

`TransactionInterface.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Returns the list of validation errors, if any.

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
Use EOACode7702Transaction.getMessageToSign to get a tx hash for the purpose of signing.

#### Returns

`Uint8Array`

Hash of the serialized signed transaction

#### Implementation of

`TransactionInterface.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Indicates whether the transaction already carries signature data.

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

true if the transaction has no validation issues

#### Implementation of

`TransactionInterface.isValid`

***

### raw()

> **raw**(): `EOACode7702TxValuesArray`

Returns a Uint8Array Array of the raw Bytes of the EIP-7702 transaction, in order.

Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, authorizationList, signatureYParity, signatureR, signatureS]`

Use EOACode7702Transaction.serialize to add a transaction to a block
with createBlockFromBytesArray.

For an unsigned tx this method uses the empty Bytes values for the
signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
representation for external signing use EOACode7702Transaction.getMessageToSign.

#### Returns

`EOACode7702TxValuesArray`

#### Implementation of

`TransactionInterface.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the serialized encoding of the EIP-7702 transaction.

Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
accessList, authorizationList, signatureYParity, signatureR, signatureS])`

Note that in contrast to the legacy tx serialization format this is not
valid RLP any more due to the raw tx type preceding and concatenated to
the RLP encoding of the values.

#### Returns

`Uint8Array`

#### Implementation of

`TransactionInterface.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `EOACode7702Tx`

Signs the transaction and returns the signed instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `privateKey` | `Uint8Array` | 32-byte private key |
| `extraEntropy?` | `boolean` \| `Uint8Array`\<`ArrayBufferLike`\> | Optional entropy supplied to the signing routine |

#### Returns

`EOACode7702Tx`

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

| Parameter | Type |
| ------ | ------ |
| `capability` | `number` |

#### Returns

`boolean`

#### Implementation of

`TransactionInterface.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `never`

EOACode7702Tx cannot create contracts

#### Returns

`never`

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

Verifies the embedded signature.

#### Returns

`boolean`

true if signature verification succeeds

#### Implementation of

`TransactionInterface.verifySignature`
