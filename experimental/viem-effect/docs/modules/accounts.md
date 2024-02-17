[@tevm/viem-effect](../README.md) / [Modules](../modules.md) / accounts

# Module: accounts

## Table of contents

### Functions

- [generateMnemonicEffect](accounts.md#generatemnemoniceffect)
- [generatePrivateKeyEffect](accounts.md#generateprivatekeyeffect)
- [hdKeyToAccountEffect](accounts.md#hdkeytoaccounteffect)
- [mnemonicToAccountEffect](accounts.md#mnemonictoaccounteffect)
- [parseAccountEffect](accounts.md#parseaccounteffect)
- [privateKeyToAccountEffect](accounts.md#privatekeytoaccounteffect)
- [privateKeyToAddressEffect](accounts.md#privatekeytoaddresseffect)
- [publicKeyToAddressEffect](accounts.md#publickeytoaddresseffect)
- [signEffect](accounts.md#signeffect)
- [signMessageEffect](accounts.md#signmessageeffect)
- [signTransactionEffect](accounts.md#signtransactioneffect)
- [signTypedDataEffect](accounts.md#signtypeddataeffect)
- [toAccountEffect](accounts.md#toaccounteffect)

## Functions

### generateMnemonicEffect

▸ **generateMnemonicEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GenerateMnemonicErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [wordlist: string[]] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GenerateMnemonicErrorType`, `string`\>

#### Defined in

[experimental/viem-effect/src/accounts/generateMnemonicEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/generateMnemonicEffect.js#L7)

___

### generatePrivateKeyEffect

▸ **generatePrivateKeyEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GeneratePrivateKeyErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GeneratePrivateKeyErrorType`, \`0x$\{string}\`\>

#### Defined in

[experimental/viem-effect/src/accounts/generatePrivateKeyEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/generatePrivateKeyEffect.js#L7)

___

### hdKeyToAccountEffect

▸ **hdKeyToAccountEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `never`, `HDAccount`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [hdKey\_: HDKey, HDOptions?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `never`, `HDAccount`\>

#### Defined in

[experimental/viem-effect/src/accounts/hdKeyToAccountEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/hdKeyToAccountEffect.js#L7)

___

### mnemonicToAccountEffect

▸ **mnemonicToAccountEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `MnemonicToAccountErrorType`, `HDAccount`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [mnemonic: string, opts?: HDOptions] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `MnemonicToAccountErrorType`, `HDAccount`\>

#### Defined in

[experimental/viem-effect/src/accounts/mnemonicToAccountEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/mnemonicToAccountEffect.js#L7)

___

### parseAccountEffect

▸ **parseAccountEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ParseAccountErrorType`, `Account`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [account: \`0x$\{string}\` \| Account] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ParseAccountErrorType`, `Account`\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/parseAccountEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/parseAccountEffect.js#L7)

___

### privateKeyToAccountEffect

▸ **privateKeyToAccountEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `PrivateKeyToAccountErrorType`, `PrivateKeyAccount`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [privateKey: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `PrivateKeyToAccountErrorType`, `PrivateKeyAccount`\>

#### Defined in

[experimental/viem-effect/src/accounts/privateKeyToAccountEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/privateKeyToAccountEffect.js#L7)

___

### privateKeyToAddressEffect

▸ **privateKeyToAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `PrivateKeyToAddressErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [privateKey: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `PrivateKeyToAddressErrorType`, \`0x$\{string}\`\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/privateKeyToAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/privateKeyToAddressEffect.js#L7)

___

### publicKeyToAddressEffect

▸ **publicKeyToAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `PublicKeyToAddressErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [publicKey: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `PublicKeyToAddressErrorType`, \`0x$\{string}\`\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/publicKeyToAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/publicKeyToAddressEffect.js#L7)

___

### signEffect

▸ **signEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SignErrorType`, `Signature`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`SignParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SignErrorType`, `Signature`\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/signEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/signEffect.js#L7)

___

### signMessageEffect

▸ **signMessageEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SignMessageErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`SignMessageParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SignMessageErrorType`, \`0x$\{string}\`\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/signMessageEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/signMessageEffect.js#L7)

___

### signTransactionEffect

▸ **signTransactionEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SignTransactionErrorType`, `SignTransactionReturnType`\<`TransactionSerializable`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`SignTransactionParameters`\<`TransactionSerializable`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SignTransactionErrorType`, `SignTransactionReturnType`\<`TransactionSerializable`\>\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/signTransactionEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/signTransactionEffect.js#L7)

___

### signTypedDataEffect

▸ **signTypedDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SignTypedDataErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`SignTypedDataParameters`\<\{ `address`: `undefined` ; `bool`: `undefined` ; `bytes`: `undefined` ; `bytes1`: `undefined` ; `bytes10`: `undefined` ; `bytes11`: `undefined` ; `bytes12`: `undefined` ; `bytes13`: `undefined` ; `bytes14`: `undefined` ; `bytes15`: `undefined` ; `bytes16`: `undefined` ; `bytes17`: `undefined` ; `bytes18`: `undefined` ; `bytes19`: `undefined` ; `bytes2`: `undefined` ; `bytes20`: `undefined` ; `bytes21`: `undefined` ; `bytes22`: `undefined` ; `bytes23`: `undefined` ; `bytes24`: `undefined` ; `bytes25`: `undefined` ; `bytes26`: `undefined` ; `bytes27`: `undefined` ; `bytes28`: `undefined` ; `bytes29`: `undefined` ; `bytes3`: `undefined` ; `bytes30`: `undefined` ; `bytes31`: `undefined` ; `bytes32`: `undefined` ; `bytes4`: `undefined` ; `bytes5`: `undefined` ; `bytes6`: `undefined` ; `bytes7`: `undefined` ; `bytes8`: `undefined` ; `bytes9`: `undefined` ; `int104`: `undefined` ; `int112`: `undefined` ; `int120`: `undefined` ; `int128`: `undefined` ; `int136`: `undefined` ; `int144`: `undefined` ; `int152`: `undefined` ; `int16`: `undefined` ; `int160`: `undefined` ; `int168`: `undefined` ; `int176`: `undefined` ; `int184`: `undefined` ; `int192`: `undefined` ; `int200`: `undefined` ; `int208`: `undefined` ; `int216`: `undefined` ; `int224`: `undefined` ; `int232`: `undefined` ; `int24`: `undefined` ; `int240`: `undefined` ; `int248`: `undefined` ; `int256`: `undefined` ; `int32`: `undefined` ; `int40`: `undefined` ; `int48`: `undefined` ; `int56`: `undefined` ; `int64`: `undefined` ; `int72`: `undefined` ; `int8`: `undefined` ; `int80`: `undefined` ; `int88`: `undefined` ; `int96`: `undefined` ; `string`: `undefined` ; `uint104`: `undefined` ; `uint112`: `undefined` ; `uint120`: `undefined` ; `uint128`: `undefined` ; `uint136`: `undefined` ; `uint144`: `undefined` ; `uint152`: `undefined` ; `uint16`: `undefined` ; `uint160`: `undefined` ; `uint168`: `undefined` ; `uint176`: `undefined` ; `uint184`: `undefined` ; `uint192`: `undefined` ; `uint200`: `undefined` ; `uint208`: `undefined` ; `uint216`: `undefined` ; `uint224`: `undefined` ; `uint232`: `undefined` ; `uint24`: `undefined` ; `uint240`: `undefined` ; `uint248`: `undefined` ; `uint256`: `undefined` ; `uint32`: `undefined` ; `uint40`: `undefined` ; `uint48`: `undefined` ; `uint56`: `undefined` ; `uint64`: `undefined` ; `uint72`: `undefined` ; `uint8`: `undefined` ; `uint80`: `undefined` ; `uint88`: `undefined` ; `uint96`: `undefined`  } \| \{ `[key: string]`: `unknown`;  }, `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SignTypedDataErrorType`, \`0x$\{string}\`\>

#### Defined in

[experimental/viem-effect/src/accounts/utils/signTypedDataEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/utils/signTypedDataEffect.js#L7)

___

### toAccountEffect

▸ **toAccountEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ToAccountErrorType`, `GetAccountReturnType`\<`AccountSource`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [source: AccountSource] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ToAccountErrorType`, `GetAccountReturnType`\<`AccountSource`\>\>

#### Defined in

[experimental/viem-effect/src/accounts/toAccountEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/accounts/toAccountEffect.js#L7)
