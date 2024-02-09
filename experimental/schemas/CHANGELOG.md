# @tevm/schemas

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

## 1.0.0-next.23

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports

## 1.0.0-next.9

### Patch Changes

- [#686](https://github.com/evmts/tevm-monorepo/pull/686) [`28c82d39`](https://github.com/evmts/tevm-monorepo/commit/28c82d3975a0e1f736353a52144cb3246f1a88ae) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed effect/schema version

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/tevm-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/tevm-monorepo/pull/676) [`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.0

### Patch Changes

- [#508](https://github.com/evmts/tevm-monorepo/pull/508) [`f5d4c068`](https://github.com/evmts/tevm-monorepo/commit/f5d4c0682f44b939b3156f5cae15d0041790631f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added UINT and INT Effect.ts solidity types to @tevm/schema

- [#548](https://github.com/evmts/tevm-monorepo/pull/548) [`c12528a3`](https://github.com/evmts/tevm-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all packages to automatically generate up to date reference docs

- [#611](https://github.com/evmts/tevm-monorepo/pull/611) [`747728d9`](https://github.com/evmts/tevm-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- [#510](https://github.com/evmts/tevm-monorepo/pull/510) [`085219e6`](https://github.com/evmts/tevm-monorepo/commit/085219e6ea3992087448acd388911fc42c5cadb9) Thanks [@roninjin10](https://github.com/roninjin10)! - Added BytesFixed solidity type

- [#506](https://github.com/evmts/tevm-monorepo/pull/506) [`4e95988f`](https://github.com/evmts/tevm-monorepo/commit/4e95988fb09edecfeff021f24f7e9b5b8381a56c) Thanks [@roninjin10](https://github.com/roninjin10)! - Initialized schemas package. Schemas package is the source of truth for types in Tevm. It exports types, effect validators, Error types, and vanilla js validators for all types

  See [schemas package docs](https://github.com/evmts/tevm-monorepo/tree/main/schemas/docs/modules.md) for generated up to date API reference docs.
