[@tevm/common](README.md) / Exports

# @tevm/common

## Table of contents

### Classes

- [TevmCommon](classes/TevmCommon.md)

### Type Aliases

- [CommonOptions](modules.md#commonoptions)
- [Hardfork](modules.md#hardfork)

### Functions

- [createCommon](modules.md#createcommon)

## Type Aliases

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

▸ **createCommon**(`options`): [`TevmCommon`](classes/TevmCommon.md)

Creates an ethereumjs Common object used by the EVM
to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CommonOptions`](modules.md#commonoptions) |

#### Returns

[`TevmCommon`](classes/TevmCommon.md)

#### Defined in

[packages/common/src/createCommon.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/createCommon.js#L11)
