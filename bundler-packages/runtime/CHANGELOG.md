# @tevm/runtime

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/tsconfig@1.0.0-next.28
  - @tevm/tsupconfig@1.0.0-next.28

## 1.0.0-next.25

### Patch Changes

- [#901](https://github.com/evmts/tevm-monorepo/pull/901) [`31fad1501a19c0e6682531fa2f8d181908a4bb48`](https://github.com/evmts/tevm-monorepo/commit/31fad1501a19c0e6682531fa2f8d181908a4bb48) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with MJS files incorrectly resolving contracts with bytecode

## 1.0.0-next.23

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports
- Updated dependencies [[`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3)]:
  - @tevm/tsconfig@1.0.0-next.23
  - @tevm/tsupconfig@1.0.0-next.23

## 1.0.0-next.13

### Patch Changes

- [#694](https://github.com/evmts/tevm-monorepo/pull/694) [`85de0e10`](https://github.com/evmts/tevm-monorepo/commit/85de0e101c075868d8a1948ad39f6887891f5ac8) Thanks [@roninjin10](https://github.com/roninjin10)! - Prefix 0x in tevm/runtime bytecode

## 1.0.0-next.11

### Minor Changes

- [#690](https://github.com/evmts/tevm-monorepo/pull/690) [`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployedBytecode to tevm contract instances

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/tevm-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

- Updated dependencies [[`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2)]:
  - @tevm/tsconfig@1.0.0-next.5

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/tevm-monorepo/pull/676) [`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/tevm-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/tevm-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to Tevm bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

## 1.0.0-next.0

### Patch Changes

- [#611](https://github.com/evmts/tevm-monorepo/pull/611) [`747728d9`](https://github.com/evmts/tevm-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- Updated dependencies [[`a8248fb5`](https://github.com/evmts/tevm-monorepo/commit/a8248fb5008594a2c5d0797780d7d033a455c442)]:
  - @tevm/tsconfig@1.0.0-next.0
