# @evmts/runtime

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/evmts-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/evmts-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/evmts-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

- Updated dependencies [[`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2)]:
  - @evmts/tsconfig@1.0.0-next.5

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/evmts-monorepo/pull/676) [`93cab845`](https://github.com/evmts/evmts-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/evmts-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/evmts-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to EVMts bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

## 1.0.0-next.0

### Patch Changes

- [#611](https://github.com/evmts/evmts-monorepo/pull/611) [`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- Updated dependencies [[`a8248fb5`](https://github.com/evmts/evmts-monorepo/commit/a8248fb5008594a2c5d0797780d7d033a455c442)]:
  - @evmts/tsconfig@1.0.0-next.0
