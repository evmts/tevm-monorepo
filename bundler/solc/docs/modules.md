[@tevm/solc](README.md) / Modules

# @tevm/solc

## Table of contents

### Variables

- [fileLevelOption](undefined)
- [releases](undefined)

### Functions

- [createSolc](undefined)
- [solcCompile](undefined)

## Variables

### fileLevelOption

• `Const` **fileLevelOption**: "" = `''`

#### Defined in

[solc.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/solc.js#L7)

___

### releases

• `Const` **releases**: Releases

#### Defined in

[solc.js:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/solc.js#L12)

## Functions

### createSolc

▸ **createSolc**(`release`): Promise\<Solc\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `release` | keyof Releases |

#### Returns

Promise\<Solc\>

An instance of solc

#### Defined in

[solc.js:135](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/solc.js#L135)

___

### solcCompile

▸ **solcCompile**(`solc`, `input`): SolcOutput

Typesafe wrapper around solc.compile

#### Parameters

| Name | Type |
| :------ | :------ |
| `solc` | any |
| `input` | SolcInputDescription |

#### Returns

SolcOutput

#### Defined in

[solc.js:127](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/solc.js#L127)
