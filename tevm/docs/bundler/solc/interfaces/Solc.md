[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / Solc

# Interface: Solc

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:325

## Properties

### compile()

> **compile**: (`input`) => [`SolcOutput`](../type-aliases/SolcOutput.md)

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:331

#### Parameters

##### input

[`SolcInputDescription`](../type-aliases/SolcInputDescription.md)

#### Returns

[`SolcOutput`](../type-aliases/SolcOutput.md)

***

### features

> **features**: `FeaturesConfig`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:330

***

### license

> **license**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:328

***

### loadRemoteVersion()

> **loadRemoteVersion**: (`versionString`, `callback`) => `void`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:332

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

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:329

***

### semver

> **semver**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:327

***

### setupMethods()

> **setupMethods**: (`soljson`) => `void`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:333

#### Parameters

##### soljson

`any`

#### Returns

`void`

***

### version

> **version**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:326
