# @evmts/core

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

- [#252](https://github.com/evmts/evmts-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed EVMts configuration to be purely from tsconfig

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
