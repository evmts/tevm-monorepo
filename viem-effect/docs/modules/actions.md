[@evmts/viem-effect](/reference/viem-effect/README.md) / [Modules](/reference/viem-effect/modules.md) / actions

# Module: actions

## Table of contents

### Functions

- [getContractEffect](/reference/viem-effect/modules/actions.md#getcontracteffect)

## Functions

### getContractEffect

▸ **getContractEffect**<`TParams`\>(`...args`): `Effect`<`never`, `GetContractErrorType`, `GetContractReturnType`<`Abi` \| readonly `unknown`[], `undefined` \| `Client`<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x${string}\`, `string`, `string`, `string`, ``true``\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`GetContractParameters`<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`, `Abi` \| readonly `unknown`[], `undefined` \| `Client`<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x${string}\`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`<`never`, `GetContractErrorType`, `GetContractReturnType`<`Abi` \| readonly `unknown`[], `undefined` \| `Client`<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x${string}\`, `string`, `string`, `string`, ``true``\>\>

#### Defined in

[viem-effect/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/viem-effect/src/wrapInEffect.d.ts#L14)
