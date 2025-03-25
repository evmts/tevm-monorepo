[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / Solc

# Interface: Solc

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:444

## Properties

### compile()

> **compile**: (`input`) => [`SolcOutput`](../type-aliases/SolcOutput.md)

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:450

#### Parameters

##### input

[`SolcInputDescription`](../type-aliases/SolcInputDescription.md)

#### Returns

[`SolcOutput`](../type-aliases/SolcOutput.md)

***

### features

> **features**: `FeaturesConfig`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:449

***

### license

> **license**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:447

***

### loadRemoteVersion()

> **loadRemoteVersion**: (`versionString`, `callback`) => `void`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:451

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

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:448

***

### semver

> **semver**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:446

***

### setupMethods()

> **setupMethods**: (`soljson`) => `void`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:452

#### Parameters

##### soljson

`any`

#### Returns

`void`

***

### version

> **version**: `string`

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:445
