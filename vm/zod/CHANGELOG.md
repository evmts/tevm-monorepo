# @tevm/contract

## 1.0.0-next.22

### Patch Changes

- [#807](https://github.com/evmts/tevm-monorepo/pull/807) [`3b4a347d`](https://github.com/evmts/tevm-monorepo/commit/3b4a347da4c0086b22a276b31442d5b22855a2ba) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with zod validator swallowing missing `to` parameter errors

- [#804](https://github.com/evmts/tevm-monorepo/pull/804) [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with JsonRpcRequest throwing for requests with no params

- [#806](https://github.com/evmts/tevm-monorepo/pull/806) [`aec294ba`](https://github.com/evmts/tevm-monorepo/commit/aec294ba6a3f4fc7bade3ac2286a6bf317b2112c) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in zod validators for contract params which falsely listed `to` as optional

- Updated dependencies [[`87427f30`](https://github.com/evmts/tevm-monorepo/commit/87427f30aeaba4c191d432e23a58d589d02e269b), [`cae17b7d`](https://github.com/evmts/tevm-monorepo/commit/cae17b7d9e4c65a28649a37fcf541d400c951127), [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80), [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57), [`0ee22d0a`](https://github.com/evmts/tevm-monorepo/commit/0ee22d0a2f39b140f0670525959bb6fe8d5dcf57), [`941a630a`](https://github.com/evmts/tevm-monorepo/commit/941a630ada850220d62f55719f202f33e216de7f)]:
  - @tevm/api@1.0.0-next.22

## 1.0.0-next.21

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added @tevm/zod package. This package provides common zod validation for the Tevm JSON-RPC api

- Updated dependencies [[`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa)]:
  - @tevm/api@1.0.0-next.21

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
