[@tevm/contract](README.md) / Exports

# @tevm/contract

## Table of contents

### Type Aliases

- [TevmContract](modules.md#tevmcontract)

### Functions

- [createTevmContract](modules.md#createtevmcontract)
- [createTevmContractFromAbi](modules.md#createtevmcontractfromabi)
- [formatAbi](modules.md#formatabi)
- [parseAbi](modules.md#parseabi)

## Type Aliases

### TevmContract

Ƭ **TevmContract**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |
| `TBytecode` | extends `Hex` \| `undefined` |
| `TDeployedBytecode` | extends `Hex` \| `undefined` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `ParseAbi`\<`THumanReadableAbi`\> |
| `bytecode` | `TBytecode` |
| `deployedBytecode` | `TDeployedBytecode` |
| `events` | `Events`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | `Read`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |
| `write` | `Write`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |

#### Defined in

[packages/contract/src/TevmContract.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/TevmContract.ts#L7)

## Functions

### createTevmContract

▸ **createTevmContract**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>(`«destructured»`): [`TevmContract`](modules.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`TevmContract`](modules.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>, ``"name"`` \| ``"bytecode"`` \| ``"deployedBytecode"`` \| ``"humanReadableAbi"``\> |

#### Returns

[`TevmContract`](modules.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[packages/contract/src/createTevmContract.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createTevmContract.ts#L8)

___

### createTevmContractFromAbi

▸ **createTevmContractFromAbi**\<`TName`, `TAbi`, `TBytecode`, `TDeployedBytecode`\>(`«destructured»`): [`TevmContract`](modules.md#tevmcontract)\<`TName`, `FormatAbi`\<`TAbi`\>, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `TAbi` | extends `Abi` |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`TevmContract`](modules.md#tevmcontract)\<`TName`, `FormatAbi`\<`TAbi`\>, `TBytecode`, `TDeployedBytecode`\>, ``"name"`` \| ``"abi"`` \| ``"bytecode"`` \| ``"deployedBytecode"``\> |

#### Returns

[`TevmContract`](modules.md#tevmcontract)\<`TName`, `FormatAbi`\<`TAbi`\>, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[packages/contract/src/createTevmContractFromAbi.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createTevmContractFromAbi.ts#L8)

___

### formatAbi

▸ **formatAbi**\<`TAbi`\>(`abi`): `FormatAbi`\<`TAbi`\>

Parses JSON ABI into human-readable ABI

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `abi` | `TAbi` | ABI |

#### Returns

`FormatAbi`\<`TAbi`\>

Human-readable ABI

#### Defined in

node_modules/.pnpm/abitype@0.10.2_typescript@5.2.2_zod@3.22.4/node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:18

___

### parseAbi

▸ **parseAbi**\<`TSignatures`\>(`signatures`): `ParseAbi`\<`TSignatures`\>

Parses human-readable ABI into JSON Abi

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSignatures` | extends readonly `string`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signatures` | `TSignatures`[``"length"``] extends ``0`` ? [``"Error: At least one signature required"``] : `Signatures`\<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\> | Human-Readable ABI |

#### Returns

`ParseAbi`\<`TSignatures`\>

Parsed Abi

**`Example`**

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

#### Defined in

node_modules/.pnpm/abitype@0.10.2_typescript@5.2.2_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37
