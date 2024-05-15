**@tevm/tx** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ImpersonatedTx

# Class: ImpersonatedTx

## Constructors

### new ImpersonatedTx(txData, opts)

> **new ImpersonatedTx**(`txData`, `opts`?): [`ImpersonatedTx`](ImpersonatedTx.md)

#### Parameters

▪ **txData**: `FeeMarketEIP1559TxData` & `object`

▪ **opts?**: [`TxOptions`](../interfaces/TxOptions.md)= `{}`

#### Source

[packages/tx/src/ImpersonatedTx.js:225](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L225)

## Properties

### \_impersonatedAddress

> **`private`** **\_impersonatedAddress**: `Address`

The impersonated sender

#### Source

[packages/tx/src/ImpersonatedTx.js:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L117)

***

### \_wrappedTx

> **`private`** **\_wrappedTx**: [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Source

[packages/tx/src/ImpersonatedTx.js:111](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L111)

## Accessors

### AccessListJSON

> **`get`** **AccessListJSON**(): [`AccessList`](../type-aliases/AccessList.md)

#### Source

[packages/tx/src/ImpersonatedTx.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L45)

***

### DEFAULT\_CHAIN

> **`get`** **`protected`** **DEFAULT\_CHAIN**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L41)

***

### \_type

> **`get`** **`protected`** **\_type**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L34)

***

### accessList

> **`get`** **accessList**(): `AccessListBytes`

#### Source

[packages/tx/src/ImpersonatedTx.js:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L68)

***

### activeCapabilities

> **`get`** **`protected`** **activeCapabilities**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L51)

***

### cache

> **`get`** **cache**(): `TransactionCache`

#### Source

[packages/tx/src/ImpersonatedTx.js:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L74)

***

### chainId

> **`get`** **chainId**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L83)

***

### common

> **`get`** **common**(): `Common`

#### Source

[packages/tx/src/ImpersonatedTx.js:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L86)

***

### data

> **`get`** **data**(): `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L92)

***

### gasLimit

> **`get`** **gasLimit**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L58)

***

### maxFeePerGas

> **`get`** **maxFeePerGas**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L71)

***

### maxPriorityFeePerGas

> **`get`** **maxPriorityFeePerGas**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L55)

***

### nonce

> **`get`** **nonce**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L77)

***

### r

> **`get`** **r**(): `undefined` \| `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:98](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L98)

***

### s

> **`get`** **s**(): `undefined` \| `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L101)

***

### to

> **`get`** **to**(): `undefined` \| `Address`

#### Source

[packages/tx/src/ImpersonatedTx.js:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L95)

***

### txOptions

> **`get`** **`protected`** **txOptions**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L64)

***

### type

> **`get`** **type**(): [`TransactionType`](../enumerations/TransactionType.md)

#### Source

[packages/tx/src/ImpersonatedTx.js:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L89)

***

### v

> **`get`** **v**(): `undefined` \| `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L104)

***

### value

> **`get`** **value**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L80)

## Methods

### \_errorMsg()

> **`protected`** **\_errorMsg**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L27)

***

### \_getCommon()

> **\_getCommon**(): `Common`

#### Source

[packages/tx/src/ImpersonatedTx.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L21)

***

### \_getSharedErrorPostfix()

> **`protected`** **\_getSharedErrorPostfix**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L17)

***

### \_validateCannotExceedMaxInteger()

> **`protected`** **\_validateCannotExceedMaxInteger**(): `any`

#### Source

[packages/tx/src/ImpersonatedTx.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L10)

***

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Parameters

▪ **v**: `bigint`

▪ **r**: `bigint`

▪ **s**: `bigint`

▪ **convertV?**: `boolean`

#### Source

[packages/tx/src/ImpersonatedTx.js:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L185)

***

### errorStr()

> **errorStr**(): `string`

#### Source

[packages/tx/src/ImpersonatedTx.js:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L160)

***

### getBaseFee()

> **getBaseFee**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:175](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L175)

***

### getDataFee()

> **getDataFee**(): `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:194](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L194)

***

### getEffectivePriorityFee()

> **getEffectivePriorityFee**(`baseFee`): `bigint`

#### Parameters

▪ **baseFee**: `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:215](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L215)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L137)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:200](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L200)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:218](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L218)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

#### Source

[packages/tx/src/ImpersonatedTx.js:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L133)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:206](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L206)

***

### getUpfrontCost()

> **getUpfrontCost**(`baseFee`): `bigint`

#### Parameters

▪ **baseFee**: `bigint`

#### Source

[packages/tx/src/ImpersonatedTx.js:191](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L191)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Source

[packages/tx/src/ImpersonatedTx.js:209](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L209)

***

### hash()

> **hash**(): `Uint8Array`

Computes a sha3-256 hash of the serialized tx.

This method is faked for transactions that don't have a signer (impersonated). The returned hash is simply keccak256 of the message that is usually signed
See also [FeeMarketEIP1559Transaction.getMessageToSign](FeeMarketEIP1559Transaction.md#getmessagetosign)

#### Source

[packages/tx/src/ImpersonatedTx.js:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L125)

***

### isSigned()

> **isSigned**(): `boolean`

#### Source

[packages/tx/src/ImpersonatedTx.js:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L129)

***

### isValid()

> **isValid**(): `boolean`

#### Source

[packages/tx/src/ImpersonatedTx.js:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L156)

***

### raw()

> **raw**(): `FeeMarketEIP1559TxValuesArray`

#### Source

[packages/tx/src/ImpersonatedTx.js:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L141)

***

### serialize()

> **serialize**(): `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L171)

***

### sign()

> **sign**(`privateKey`): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md)

#### Parameters

▪ **privateKey**: `Uint8Array`

#### Source

[packages/tx/src/ImpersonatedTx.js:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L148)

***

### supports()

> **supports**(`capability`): `boolean`

#### Parameters

▪ **capability**: [`Capability`](../enumerations/Capability.md)

#### Source

[packages/tx/src/ImpersonatedTx.js:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L167)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Source

[packages/tx/src/ImpersonatedTx.js:203](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L203)

***

### toJSON()

> **toJSON**(): [`JsonTx`](../interfaces/JsonTx.md)

#### Source

[packages/tx/src/ImpersonatedTx.js:152](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L152)

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Source

[packages/tx/src/ImpersonatedTx.js:197](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/ImpersonatedTx.js#L197)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
