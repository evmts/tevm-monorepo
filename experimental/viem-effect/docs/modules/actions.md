[@tevm/viem-effect](../README.md) / [Modules](../modules.md) / actions

# Module: actions

## Table of contents

### Functions

- [getContractEffect](actions.md#getcontracteffect)

## Functions

### getContractEffect

▸ **getContractEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetContractErrorType`, `GetContractReturnType`\<`Abi` \| readonly `unknown`[], `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x$\{string}\`, `string`, `string`, `string`, ``true``\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`GetContractParameters`\<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`, `Abi` \| readonly `unknown`[], `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x$\{string}\`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetContractErrorType`, `GetContractReturnType`\<`Abi` \| readonly `unknown`[], `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x$\{string}\`, `string`, `string`, `string`, ``true``\>\>

#### Defined in

[experimental/viem-effect/src/actions/getContractEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/actions/getContractEffect.js#L7)
