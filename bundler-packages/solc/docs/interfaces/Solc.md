[@tevm/solc](../README.md) / [Exports](../modules.md) / Solc

# Interface: Solc

## Table of contents

### Properties

- [compile](Solc.md#compile)
- [features](Solc.md#features)
- [license](Solc.md#license)
- [loadRemoteVersion](Solc.md#loadremoteversion)
- [lowlevel](Solc.md#lowlevel)
- [semver](Solc.md#semver)
- [setupMethods](Solc.md#setupmethods)
- [version](Solc.md#version)

## Properties

### compile

• **compile**: (`input`: [`SolcInputDescription`](../modules.md#solcinputdescription)) => [`SolcOutput`](../modules.md#solcoutput)

#### Type declaration

▸ (`input`): [`SolcOutput`](../modules.md#solcoutput)

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SolcInputDescription`](../modules.md#solcinputdescription) |

##### Returns

[`SolcOutput`](../modules.md#solcoutput)

#### Defined in

[solcTypes.ts:757](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L757)

___

### features

• **features**: `FeaturesConfig`

#### Defined in

[solcTypes.ts:756](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L756)

___

### license

• **license**: `string`

#### Defined in

[solcTypes.ts:754](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L754)

___

### loadRemoteVersion

• **loadRemoteVersion**: (`versionString`: `string`, `callback`: (`err`: ``null`` \| `Error`, `solc?`: [`Solc`](Solc.md)) => `void`) => `void`

#### Type declaration

▸ (`versionString`, `callback`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `versionString` | `string` |
| `callback` | (`err`: ``null`` \| `Error`, `solc?`: [`Solc`](Solc.md)) => `void` |

##### Returns

`void`

#### Defined in

[solcTypes.ts:758](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L758)

___

### lowlevel

• **lowlevel**: `LowLevelConfig`

#### Defined in

[solcTypes.ts:755](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L755)

___

### semver

• **semver**: `string`

#### Defined in

[solcTypes.ts:753](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L753)

___

### setupMethods

• **setupMethods**: (`soljson`: `any`) => `void`

#### Type declaration

▸ (`soljson`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `soljson` | `any` |

##### Returns

`void`

#### Defined in

[solcTypes.ts:762](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L762)

___

### version

• **version**: `string`

#### Defined in

[solcTypes.ts:752](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L752)
