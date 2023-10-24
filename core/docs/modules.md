[@evmts/core](/reference/core/README.md) / Exports

# @evmts/core

## Table of contents

### Type Aliases

- [EvmtsContract](/reference/core/modules.md#evmtscontract)

### Functions

- [evmtsContractFactory](/reference/core/modules.md#evmtscontractfactory)
- [formatAbi](/reference/core/modules.md#formatabi)
- [parseAbi](/reference/core/modules.md#parseabi)

## Type Aliases

### EvmtsContract

Ƭ **EvmtsContract**<`TName`, `THumanReadableAbi`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`<`string`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `ParseAbi`<`THumanReadableAbi`\> |
| `events` | `Events`<`TName`, `THumanReadableAbi`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | `Read`<`TName`, `THumanReadableAbi`\> |
| `write` | `Write`<`TName`, `THumanReadableAbi`\> |

#### Defined in

[core/src/EvmtsContract.ts:6](https://github.com/evmts/evmts-monorepo/blob/main/core/src/EvmtsContract.ts#L6)

## Functions

### evmtsContractFactory

▸ **evmtsContractFactory**<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`EvmtsContract`](/reference/core/modules.md#evmtscontract)<`TName`, `THumanReadableAbi`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`<[`EvmtsContract`](/reference/core/modules.md#evmtscontract)<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"``\> |

#### Returns

[`EvmtsContract`](/reference/core/modules.md#evmtscontract)<`TName`, `THumanReadableAbi`\>

#### Defined in

[core/src/evmtsContractFactory.ts:7](https://github.com/evmts/evmts-monorepo/blob/main/core/src/evmtsContractFactory.ts#L7)

___

### formatAbi

▸ **formatAbi**<`TAbi`\>(`abi`): `FormatAbi`<`TAbi`\>

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

`FormatAbi`<`TAbi`\>

Human-readable ABI

#### Defined in

node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:18

___

### parseAbi

▸ **parseAbi**<`TSignatures`\>(`signatures`): `ParseAbi`<`TSignatures`\>

Parses human-readable ABI into JSON Abi

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSignatures` | extends readonly `string`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signatures` | `TSignatures`[``"length"``] extends ``0`` ? [``"Error: At least one signature required"``] : `Signatures`<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`<`TSignatures`\> | Human-Readable ABI |

#### Returns

`ParseAbi`<`TSignatures`\>

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

node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37
