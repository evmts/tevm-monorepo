[**tevm**](../../../README.md) • **Docs**

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / Solc

# Interface: Solc

## Properties

### compile()

> **compile**: (`input`) => [`SolcOutput`](../type-aliases/SolcOutput.md)

#### Parameters

• **input**: [`SolcInputDescription`](../type-aliases/SolcInputDescription.md)

#### Returns

[`SolcOutput`](../type-aliases/SolcOutput.md)

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:330

***

### features

> **features**: `FeaturesConfig`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:329

***

### license

> **license**: `string`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:327

***

### loadRemoteVersion()

> **loadRemoteVersion**: (`versionString`, `callback`) => `void`

#### Parameters

• **versionString**: `string`

• **callback**

#### Returns

`void`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:331

***

### lowlevel

> **lowlevel**: `LowLevelConfig`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:328

***

### semver

> **semver**: `string`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:326

***

### setupMethods()

> **setupMethods**: (`soljson`) => `void`

#### Parameters

• **soljson**: `any`

#### Returns

`void`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:332

***

### version

> **version**: `string`

#### Defined in

bundler-packages/solc/types/src/solcTypes.d.ts:325
