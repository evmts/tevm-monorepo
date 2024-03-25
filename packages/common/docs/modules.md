[@tevm/common](README.md) / Exports

# @tevm/common

## Table of contents

### Classes

- [Common](classes/Common.md)

### Interfaces

- [EvmStateManagerInterface](interfaces/EvmStateManagerInterface.md)
- [StorageDump](interfaces/StorageDump.md)
- [StorageRange](interfaces/StorageRange.md)

### Type Aliases

- [AccountFields](modules.md#accountfields)
- [CommonOptions](modules.md#commonoptions)
- [Hardfork](modules.md#hardfork)

### Functions

- [createCommon](modules.md#createcommon)

## Type Aliases

### AccountFields

Ƭ **AccountFields**: `Partial`\<`Pick`\<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\>

#### Defined in

node_modules/.pnpm/@ethereumjs+common@4.3.0/node_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:30

___

### CommonOptions

Ƭ **CommonOptions**: `Object`

Options for creating an Tevm MemoryClient instance

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eips?` | `ReadonlyArray`\<`number`\> | Eips to enable. Defaults to `[1559, 4895]` |
| `hardfork?` | [`Hardfork`](modules.md#hardfork) | Hardfork to use. Defaults to `shanghai` |

#### Defined in

[packages/common/src/CommonOptions.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/CommonOptions.ts#L6)

___

### Hardfork

Ƭ **Hardfork**: ``"chainstart"`` \| ``"homestead"`` \| ``"dao"`` \| ``"tangerineWhistle"`` \| ``"spuriousDragon"`` \| ``"byzantium"`` \| ``"constantinople"`` \| ``"petersburg"`` \| ``"istanbul"`` \| ``"muirGlacier"`` \| ``"berlin"`` \| ``"london"`` \| ``"arrowGlacier"`` \| ``"grayGlacier"`` \| ``"mergeForkIdTransition"`` \| ``"paris"`` \| ``"shanghai"`` \| ``"cancun"``

Ethereum hardfork option

#### Defined in

[packages/common/src/Hardfork.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/Hardfork.ts#L4)

## Functions

### createCommon

▸ **createCommon**(`options`): [`Common`](classes/Common.md)

Creates an ethereumjs Common object used by the EVM
to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CommonOptions`](modules.md#commonoptions) |

#### Returns

[`Common`](classes/Common.md)

#### Defined in

[packages/common/src/createCommon.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/createCommon.js#L11)
