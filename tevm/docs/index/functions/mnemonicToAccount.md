[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / mnemonicToAccount

# Function: mnemonicToAccount()

> **mnemonicToAccount**(`mnemonic`, `opts`?): `object`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3/node\_modules/viem/\_types/accounts/mnemonicToAccount.d.ts:11

## Parameters

### mnemonic

`string`

### opts?

`HDKeyToAccountOptions`

## Returns

`object`

A HD Account.

### address

> **address**: `` `0x${string}` ``

### experimental\_signAuthorization()?

> `optional` **experimental\_signAuthorization**: (`parameters`) => `Promise`\<`SignAuthorizationReturnType`\>

#### Parameters

##### parameters

`Authorization`

#### Returns

`Promise`\<`SignAuthorizationReturnType`\>

### nonceManager?

> `optional` **nonceManager**: `NonceManager`

### publicKey

> **publicKey**: `` `0x${string}` ``

### sign()

> **sign**: (`parameters`) => `Promise`\<`` `0x${string}` ``\>

#### Parameters

##### parameters

###### hash

`` `0x${string}` ``

#### Returns

`Promise`\<`` `0x${string}` ``\>

### signMessage()

> **signMessage**: (`__namedParameters`) => `Promise`\<`` `0x${string}` ``\>

#### Parameters

##### \_\_namedParameters

###### message

`SignableMessage`

#### Returns

`Promise`\<`` `0x${string}` ``\>

### signTransaction()

> **signTransaction**: \<`serializer`, `transaction`\>(`transaction`, `options`?) => `Promise`\<`IsNarrowable`\<`TransactionSerialized`\<`GetTransactionType`\<`transaction`\>\>, `` `0x${string}` ``\> *extends* `true` ? `TransactionSerialized`\<`GetTransactionType`\<`transaction`\>\> : `` `0x${string}` ``\>

#### Type Parameters

• **serializer** *extends* `SerializeTransactionFn`\<`TransactionSerializable`\> = `SerializeTransactionFn`\<`TransactionSerializable`\>

• **transaction** *extends* `OneOf`\<`TransactionSerializable`\> = `Parameters`\<`serializer`\>\[`0`\]

#### Parameters

##### transaction

`transaction`

##### options?

###### serializer?

`serializer`

#### Returns

`Promise`\<`IsNarrowable`\<`TransactionSerialized`\<`GetTransactionType`\<`transaction`\>\>, `` `0x${string}` ``\> *extends* `true` ? `TransactionSerialized`\<`GetTransactionType`\<`transaction`\>\> : `` `0x${string}` ``\>

### signTypedData()

> **signTypedData**: \<`typedData`, `primaryType`\>(`parameters`) => `Promise`\<`` `0x${string}` ``\>

#### Type Parameters

• **typedData** *extends* `Record`\<`string`, `unknown`\> \| \{ `[key: `uint256[${string}]`]`: `undefined`;  `[key: `uint248[${string}]`]`: `undefined`;  `[key: `uint240[${string}]`]`: `undefined`;  `[key: `uint232[${string}]`]`: `undefined`;  `[key: `uint224[${string}]`]`: `undefined`;  `[key: `uint216[${string}]`]`: `undefined`;  `[key: `uint208[${string}]`]`: `undefined`;  `[key: `uint200[${string}]`]`: `undefined`;  `[key: `uint192[${string}]`]`: `undefined`;  `[key: `uint184[${string}]`]`: `undefined`;  `[key: `uint176[${string}]`]`: `undefined`;  `[key: `uint168[${string}]`]`: `undefined`;  `[key: `uint160[${string}]`]`: `undefined`;  `[key: `uint152[${string}]`]`: `undefined`;  `[key: `uint144[${string}]`]`: `undefined`;  `[key: `uint136[${string}]`]`: `undefined`;  `[key: `uint128[${string}]`]`: `undefined`;  `[key: `uint120[${string}]`]`: `undefined`;  `[key: `uint112[${string}]`]`: `undefined`;  `[key: `uint104[${string}]`]`: `undefined`;  `[key: `uint96[${string}]`]`: `undefined`;  `[key: `uint88[${string}]`]`: `undefined`;  `[key: `uint80[${string}]`]`: `undefined`;  `[key: `uint72[${string}]`]`: `undefined`;  `[key: `uint64[${string}]`]`: `undefined`;  `[key: `uint56[${string}]`]`: `undefined`;  `[key: `uint48[${string}]`]`: `undefined`;  `[key: `uint40[${string}]`]`: `undefined`;  `[key: `uint32[${string}]`]`: `undefined`;  `[key: `uint24[${string}]`]`: `undefined`;  `[key: `uint16[${string}]`]`: `undefined`;  `[key: `uint8[${string}]`]`: `undefined`;  `[key: `uint[${string}]`]`: `undefined`;  `[key: `int256[${string}]`]`: `undefined`;  `[key: `int248[${string}]`]`: `undefined`;  `[key: `int240[${string}]`]`: `undefined`;  `[key: `int232[${string}]`]`: `undefined`;  `[key: `int224[${string}]`]`: `undefined`;  `[key: `int216[${string}]`]`: `undefined`;  `[key: `int208[${string}]`]`: `undefined`;  `[key: `int200[${string}]`]`: `undefined`;  `[key: `int192[${string}]`]`: `undefined`;  `[key: `int184[${string}]`]`: `undefined`;  `[key: `int176[${string}]`]`: `undefined`;  `[key: `int168[${string}]`]`: `undefined`;  `[key: `int160[${string}]`]`: `undefined`;  `[key: `int152[${string}]`]`: `undefined`;  `[key: `int144[${string}]`]`: `undefined`;  `[key: `int136[${string}]`]`: `undefined`;  `[key: `int128[${string}]`]`: `undefined`;  `[key: `int120[${string}]`]`: `undefined`;  `[key: `int112[${string}]`]`: `undefined`;  `[key: `int104[${string}]`]`: `undefined`;  `[key: `int96[${string}]`]`: `undefined`;  `[key: `int88[${string}]`]`: `undefined`;  `[key: `int80[${string}]`]`: `undefined`;  `[key: `int72[${string}]`]`: `undefined`;  `[key: `int64[${string}]`]`: `undefined`;  `[key: `int56[${string}]`]`: `undefined`;  `[key: `int48[${string}]`]`: `undefined`;  `[key: `int40[${string}]`]`: `undefined`;  `[key: `int32[${string}]`]`: `undefined`;  `[key: `int24[${string}]`]`: `undefined`;  `[key: `int16[${string}]`]`: `undefined`;  `[key: `int8[${string}]`]`: `undefined`;  `[key: `int[${string}]`]`: `undefined`;  `[key: `bytes32[${string}]`]`: `undefined`;  `[key: `bytes31[${string}]`]`: `undefined`;  `[key: `bytes30[${string}]`]`: `undefined`;  `[key: `bytes29[${string}]`]`: `undefined`;  `[key: `bytes28[${string}]`]`: `undefined`;  `[key: `bytes27[${string}]`]`: `undefined`;  `[key: `bytes26[${string}]`]`: `undefined`;  `[key: `bytes24[${string}]`]`: `undefined`;  `[key: `bytes23[${string}]`]`: `undefined`;  `[key: `bytes21[${string}]`]`: `undefined`;  `[key: `bytes25[${string}]`]`: `undefined`;  `[key: `bytes20[${string}]`]`: `undefined`;  `[key: `bytes19[${string}]`]`: `undefined`;  `[key: `bytes18[${string}]`]`: `undefined`;  `[key: `bytes17[${string}]`]`: `undefined`;  `[key: `bytes16[${string}]`]`: `undefined`;  `[key: `bytes15[${string}]`]`: `undefined`;  `[key: `bytes14[${string}]`]`: `undefined`;  `[key: `bytes13[${string}]`]`: `undefined`;  `[key: `bytes12[${string}]`]`: `undefined`;  `[key: `bytes11[${string}]`]`: `undefined`;  `[key: `bytes10[${string}]`]`: `undefined`;  `[key: `bytes9[${string}]`]`: `undefined`;  `[key: `bytes8[${string}]`]`: `undefined`;  `[key: `bytes7[${string}]`]`: `undefined`;  `[key: `bytes6[${string}]`]`: `undefined`;  `[key: `bytes5[${string}]`]`: `undefined`;  `[key: `bytes4[${string}]`]`: `undefined`;  `[key: `bytes3[${string}]`]`: `undefined`;  `[key: `bytes22[${string}]`]`: `undefined`;  `[key: `bytes2[${string}]`]`: `undefined`;  `[key: `bytes1[${string}]`]`: `undefined`;  `[key: `bytes[${string}]`]`: `undefined`;  `[key: `bool[${string}]`]`: `undefined`;  `[key: `address[${string}]`]`: `undefined`;  `[key: `function[${string}]`]`: `undefined`;  `[key: `string[${string}]`]`: `undefined`;  `[key: string]`: readonly `TypedDataParameter`[];  `address`: `undefined`; `bool`: `undefined`; `bytes`: `undefined`; `bytes1`: `undefined`; `bytes10`: `undefined`; `bytes11`: `undefined`; `bytes12`: `undefined`; `bytes13`: `undefined`; `bytes14`: `undefined`; `bytes15`: `undefined`; `bytes16`: `undefined`; `bytes17`: `undefined`; `bytes18`: `undefined`; `bytes19`: `undefined`; `bytes2`: `undefined`; `bytes20`: `undefined`; `bytes21`: `undefined`; `bytes22`: `undefined`; `bytes23`: `undefined`; `bytes24`: `undefined`; `bytes25`: `undefined`; `bytes26`: `undefined`; `bytes27`: `undefined`; `bytes28`: `undefined`; `bytes29`: `undefined`; `bytes3`: `undefined`; `bytes30`: `undefined`; `bytes31`: `undefined`; `bytes32`: `undefined`; `bytes4`: `undefined`; `bytes5`: `undefined`; `bytes6`: `undefined`; `bytes7`: `undefined`; `bytes8`: `undefined`; `bytes9`: `undefined`; `int104`: `undefined`; `int112`: `undefined`; `int120`: `undefined`; `int128`: `undefined`; `int136`: `undefined`; `int144`: `undefined`; `int152`: `undefined`; `int16`: `undefined`; `int160`: `undefined`; `int168`: `undefined`; `int176`: `undefined`; `int184`: `undefined`; `int192`: `undefined`; `int200`: `undefined`; `int208`: `undefined`; `int216`: `undefined`; `int224`: `undefined`; `int232`: `undefined`; `int24`: `undefined`; `int240`: `undefined`; `int248`: `undefined`; `int256`: `undefined`; `int32`: `undefined`; `int40`: `undefined`; `int48`: `undefined`; `int56`: `undefined`; `int64`: `undefined`; `int72`: `undefined`; `int8`: `undefined`; `int80`: `undefined`; `int88`: `undefined`; `int96`: `undefined`; `string`: `undefined`; `uint104`: `undefined`; `uint112`: `undefined`; `uint120`: `undefined`; `uint128`: `undefined`; `uint136`: `undefined`; `uint144`: `undefined`; `uint152`: `undefined`; `uint16`: `undefined`; `uint160`: `undefined`; `uint168`: `undefined`; `uint176`: `undefined`; `uint184`: `undefined`; `uint192`: `undefined`; `uint200`: `undefined`; `uint208`: `undefined`; `uint216`: `undefined`; `uint224`: `undefined`; `uint232`: `undefined`; `uint24`: `undefined`; `uint240`: `undefined`; `uint248`: `undefined`; `uint256`: `undefined`; `uint32`: `undefined`; `uint40`: `undefined`; `uint48`: `undefined`; `uint56`: `undefined`; `uint64`: `undefined`; `uint72`: `undefined`; `uint8`: `undefined`; `uint80`: `undefined`; `uint88`: `undefined`; `uint96`: `undefined`; \}

• **primaryType** *extends* `string` \| `number` \| `symbol` = keyof `typedData`

#### Parameters

##### parameters

`TypedDataDefinition`\<`typedData`, `primaryType`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

### source

> **source**: `"hd"`

### type

> **type**: `"local"`

### getHdKey()

#### Returns

`HDKey`

## Description

Creates an Account from a mnemonic phrase.
