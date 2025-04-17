[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / Solc

# Interface: Solc

Defined in: [solcTypes.ts:885](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L885)

## Properties

### compile()

> **compile**: (`input`) => [`SolcOutput`](../type-aliases/SolcOutput.md)

Defined in: [solcTypes.ts:891](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L891)

#### Parameters

##### input

[`SolcInputDescription`](../type-aliases/SolcInputDescription.md)

#### Returns

[`SolcOutput`](../type-aliases/SolcOutput.md)

***

### features

> **features**: `FeaturesConfig`

Defined in: [solcTypes.ts:890](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L890)

***

### license

> **license**: `string`

Defined in: [solcTypes.ts:888](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L888)

***

### loadRemoteVersion()

> **loadRemoteVersion**: (`versionString`, `callback`) => `void`

Defined in: [solcTypes.ts:892](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L892)

#### Parameters

##### versionString

`string`

##### callback

(`err`, `solc`?) => `void`

#### Returns

`void`

***

### lowlevel

> **lowlevel**: `LowLevelConfig`

Defined in: [solcTypes.ts:889](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L889)

***

### semver

> **semver**: `string`

Defined in: [solcTypes.ts:887](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L887)

***

### setupMethods()

> **setupMethods**: (`soljson`) => `void`

Defined in: [solcTypes.ts:893](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L893)

#### Parameters

##### soljson

`any`

#### Returns

`void`

***

### version

> **version**: `string`

Defined in: [solcTypes.ts:886](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L886)
