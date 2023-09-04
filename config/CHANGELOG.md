# @evmts/core

## 0.8.0

### Patch Changes

- [#442](https://github.com/evmts/evmts-monorepo/pull/442) [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in EVMts is consistently updated to it's latest version using `pnpm up --latest`

## 0.7.0

### Minor Changes

- [#400](https://github.com/evmts/evmts-monorepo/pull/400) [`8f11961`](https://github.com/evmts/evmts-monorepo/commit/8f11961f6b3ebc5882a1e5403d3726df7ddee0d4) Thanks [@roninjin10](https://github.com/roninjin10)! - Added strict validation of the EVMts config with helpful error messages.

  - If an unknown config option is passed now EVMts will fail early
  - Improvements such as better more clear error messages with actionable messages

  Validation is done via zod.strictObject

- [#425](https://github.com/evmts/evmts-monorepo/pull/425) [`fa7555a`](https://github.com/evmts/evmts-monorepo/commit/fa7555a8b0bac268f5297544422c516dae4c5511) Thanks [@roninjin10](https://github.com/roninjin10)! - Added jsconfig.json support to EVMts. EVMts will now autodetect the tsconfig for both tsconfig.json and jsconfig.json. This enables support for JS with JSDoc comments as is popular in svelte and will be used in the upcoming Svelte example application.

### Patch Changes

- [#407](https://github.com/evmts/evmts-monorepo/pull/407) [`c71cd30`](https://github.com/evmts/evmts-monorepo/commit/c71cd30818b311c95852a720c170ef18915b750f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with swallowing error when tsconfig is missing

  - Previously the underlying error when EVMts was unable to find the tsconfig was never logged.
  - Now if EVMts cannot find the tsconfig the underlying error will be logged before logging the normal EVMts error and exiting

## 0.6.0

### Minor Changes

- [#359](https://github.com/evmts/evmts-monorepo/pull/359) [`e24901a`](https://github.com/evmts/evmts-monorepo/commit/e24901a7b503354af6174bac81a868a8598f143b) Thanks [@roninjin10](https://github.com/roninjin10)! - Added autodetection of solc version. solcVersion is no longer required

- [#377](https://github.com/evmts/evmts-monorepo/pull/377) [`3a2dfae`](https://github.com/evmts/evmts-monorepo/commit/3a2dfae3a38ca7052b57b57e5c95a952a7f0be71) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability to use env variables in EvmtsConfig

### Patch Changes

- [#373](https://github.com/evmts/evmts-monorepo/pull/373) [`6de12df`](https://github.com/evmts/evmts-monorepo/commit/6de12df39cf9da0635c246c685036e83a8e97255) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with etherscan section of the EvmtsConfig requiring all networks

- [#379](https://github.com/evmts/evmts-monorepo/pull/379) [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated build pipeline to generate .d.ts files

## 0.5.6

### Patch Changes

- [#346](https://github.com/evmts/evmts-monorepo/pull/346) [`6d9365d`](https://github.com/evmts/evmts-monorepo/commit/6d9365db3ab197ea4ad53f777d755ee3ad562b21) Thanks [@roninjin10](https://github.com/roninjin10)! - Change naming to Evmts from EVMts

## 0.5.4

### Patch Changes

- [#338](https://github.com/evmts/evmts-monorepo/pull/338) [`0116537`](https://github.com/evmts/evmts-monorepo/commit/0116537d3423c8decfd0adaf490d37d33f8a540f) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependnecies

## 0.5.0

### Minor Changes

- [#283](https://github.com/evmts/evmts-monorepo/pull/283) [`05a8efe`](https://github.com/evmts/evmts-monorepo/commit/05a8efede4acad157e3820bdba24d92f598699e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated config schema to support etherscan

  - Solc version is now listed under `compiler.solcVersion` instead of `solc`
  - Foundry projects are now listed under `compiler.foundryProject` instead of `forge`
  - Local contracts are now specified under `localContracts.contracts` instead of `deployments`
  - New external option (unimplemented) `externalContracts` which is used to specifify contracts imported from etherscan in the next release

- [#297](https://github.com/evmts/evmts-monorepo/pull/297) [`85c340d`](https://github.com/evmts/evmts-monorepo/commit/85c340dc4a63afdbc6bd92fb4b2cf3fe0ffdc6e7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added suport for non relative imports including absolute imports with baseUrl in tsconfig, imports of contracts in node_modules, and imports of contracts in foundry lib

### Patch Changes

- [#286](https://github.com/evmts/evmts-monorepo/pull/286) [`700b3d0`](https://github.com/evmts/evmts-monorepo/commit/700b3d0907df243b29e96b1b3246b8c75cfb9900) Thanks [@roninjin10](https://github.com/roninjin10)! - Made etherscan api keys a chainID mapping. This is because different chains have different etherscan keys

- [#322](https://github.com/evmts/evmts-monorepo/pull/322) [`720bfdb`](https://github.com/evmts/evmts-monorepo/commit/720bfdba790699e388c5ec1c68630b9f0f077158) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed config not throwing when unknown properties are passed

- [#322](https://github.com/evmts/evmts-monorepo/pull/322) [`720bfdb`](https://github.com/evmts/evmts-monorepo/commit/720bfdba790699e388c5ec1c68630b9f0f077158) Thanks [@roninjin10](https://github.com/roninjin10)! - Added backwards compatibility for config change with deprecation warnings

## 0.2.1

### Patch Changes

- [#276](https://github.com/evmts/evmts-monorepo/pull/276) [`2a89e13`](https://github.com/evmts/evmts-monorepo/commit/2a89e136d8dfcd997ae5ff227a96de4702dfbe19) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with parsing foundry.toml

## 0.2.0

### Minor Changes

- [#268](https://github.com/evmts/evmts-monorepo/pull/268) [`a37844f`](https://github.com/evmts/evmts-monorepo/commit/a37844faa425d1eaca112b9a09640b7ec7e288de) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for detecting foundry.toml and remappings as tsconfig option. Set forge: true in plugin tsconfig options or forge: '/path/to/binary/forge' for a custom forge binary

## 0.1.0

### Minor Changes

- [#252](https://github.com/evmts/evmts-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed Evmts configuration to be purely from tsconfig

### Patch Changes

- [#251](https://github.com/evmts/evmts-monorepo/pull/251) [`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing src folder in npm packages

## 0.0.1

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.1-next.0

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.2

### Patch Changes

- Release working proof of concept
