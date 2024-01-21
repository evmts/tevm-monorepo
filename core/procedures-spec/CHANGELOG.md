# @tevm/contract

## 1.0.0-next.22

### Minor Changes

- [#820](https://github.com/evmts/tevm-monorepo/pull/820) [`cae17b7d`](https://github.com/evmts/tevm-monorepo/commit/cae17b7d9e4c65a28649a37fcf541d400c951127) Thanks [@roninjin10](https://github.com/roninjin10)! - Added all eth*\* debug*_ and anvil\__ JSON-rpc methods and handlers to API.

- [#822](https://github.com/evmts/tevm-monorepo/pull/822) [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added eth methods such as chainId getCode and getStorageAt to Tevm.eth.

### Patch Changes

- [#811](https://github.com/evmts/tevm-monorepo/pull/811) [`87427f30`](https://github.com/evmts/tevm-monorepo/commit/87427f30aeaba4c191d432e23a58d589d02e269b) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with EVM errors requiring importing ethereumjs enum to typematch

- [#800](https://github.com/evmts/tevm-monorepo/pull/800) [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed TevmClient type to Tevm

- [#800](https://github.com/evmts/tevm-monorepo/pull/800) [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57) Thanks [@roninjin10](https://github.com/roninjin10)! - Added JSDOC to @tevm/api

- [#808](https://github.com/evmts/tevm-monorepo/pull/808) [`941a630a`](https://github.com/evmts/tevm-monorepo/commit/941a630ada850220d62f55719f202f33e216de7f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with 'to' and 'error' properties not quite working correctly for tevm. To was listed as require instead of only existing when no errors.

## 1.0.0-next.21

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Created @tevm/api package. @tevm/api is a type-only package that specifies the Tevm JSON-RPC API in detail. This API is implemented by other packages most notably @tevm/procedures which provide low level implementation of the Tevm API around ethereumjs

## 1.0.0-next.11

### Minor Changes

- [#690](https://github.com/evmts/tevm-monorepo/pull/690) [`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployedBytecode to tevm contract instances

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/tevm-monorepo/pull/676) [`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.1

### Patch Changes

- [#662](https://github.com/evmts/tevm-monorepo/pull/662) [`bba1d7e9`](https://github.com/evmts/tevm-monorepo/commit/bba1d7e92b22dba39c0aa147d486ff92878e8179) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with types missing from @tevm/vm package

## 0.0.2

### Patch Changes

- Release working proof of concept
