# @tevm/base

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/compiler@1.0.0-next.28
  - @tevm/tsconfig@1.0.0-next.28
  - @tevm/tsupconfig@1.0.0-next.28

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
  - @tevm/compiler@1.0.0-next.23
  - @tevm/tsconfig@1.0.0-next.23
  - @tevm/tsupconfig@1.0.0-next.23

## 1.0.0-next.21

### Minor Changes

- [#785](https://github.com/evmts/tevm-monorepo/pull/785) [`9c3e6a9a`](https://github.com/evmts/tevm-monorepo/commit/9c3e6a9aec2ec5b0689b2c7463525071bd67163e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated @tevm/cache api to more generalized api

### Patch Changes

- [#788](https://github.com/evmts/tevm-monorepo/pull/788) [`a7026e37`](https://github.com/evmts/tevm-monorepo/commit/a7026e372c2ce2aca2ff7f9e058fd4ff95700833) Thanks [@roninjin10](https://github.com/roninjin10)! - Improved peformance of bundler operations by utilzing more async methods rather than syncronous methods for file system access

- Updated dependencies [[`a7026e37`](https://github.com/evmts/tevm-monorepo/commit/a7026e372c2ce2aca2ff7f9e058fd4ff95700833)]:
  - @tevm/compiler@1.0.0-next.21

## 1.0.0-next.18

### Patch Changes

- Updated dependencies [[`f8121742`](https://github.com/evmts/tevm-monorepo/commit/f8121742b323483e786e7448c28962d5995a442a), [`2dbc4d62`](https://github.com/evmts/tevm-monorepo/commit/2dbc4d62f6ee6ee499c1a720f36476367618268f)]:
  - @tevm/solc@1.0.0-next.18
  - @tevm/runtime@1.0.0-next.13

## 1.0.0-next.17

### Patch Changes

- Updated dependencies [[`65462ea7`](https://github.com/evmts/tevm-monorepo/commit/65462ea79eff3abf9c7d95324d1c8c696fa0e785)]:
  - @tevm/config@1.0.0-next.17
  - @tevm/solc@1.0.0-next.17
  - @tevm/runtime@1.0.0-next.13

## 1.0.0-next.16

### Patch Changes

- Updated dependencies [[`95b534c3`](https://github.com/evmts/tevm-monorepo/commit/95b534c39c3ee637c1b4d8fdc6f9b6fd3193ce80)]:
  - @tevm/config@1.0.0-next.16
  - @tevm/solc@1.0.0-next.16
  - @tevm/runtime@1.0.0-next.13

## 1.0.0-next.15

### Patch Changes

- Updated dependencies [[`300440d8`](https://github.com/evmts/tevm-monorepo/commit/300440d84268783e7578242f67867d677dafdd34)]:
  - @tevm/config@1.0.0-next.15
  - @tevm/solc@1.0.0-next.15
  - @tevm/runtime@1.0.0-next.13

## 1.0.0-next.13

### Patch Changes

- Updated dependencies [[`85de0e10`](https://github.com/evmts/tevm-monorepo/commit/85de0e101c075868d8a1948ad39f6887891f5ac8)]:
  - @tevm/runtime@1.0.0-next.13

## 1.0.0-next.12

### Patch Changes

- Updated dependencies [[`31c5f265`](https://github.com/evmts/tevm-monorepo/commit/31c5f2654137c521bc0f3e66956de69a0a7a1c88)]:
  - @tevm/solc@1.0.0-next.12
  - @tevm/runtime@1.0.0-next.11

## 1.0.0-next.11

### Minor Changes

- [#690](https://github.com/evmts/tevm-monorepo/pull/690) [`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added deployedBytecode to tevm contract instances

### Patch Changes

- Updated dependencies [[`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d)]:
  - @tevm/runtime@1.0.0-next.11
  - @tevm/solc@1.0.0-next.11

## 1.0.0-next.9

### Patch Changes

- Updated dependencies [[`28c82d39`](https://github.com/evmts/tevm-monorepo/commit/28c82d3975a0e1f736353a52144cb3246f1a88ae)]:
  - @tevm/config@1.0.0-next.9
  - @tevm/solc@1.0.0-next.9
  - @tevm/runtime@1.0.0-next.8

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/tevm-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

- Updated dependencies [[`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830)]:
  - @tevm/runtime@1.0.0-next.8
  - @tevm/config@1.0.0-next.8
  - @tevm/solc@1.0.0-next.8

## 1.0.0-next.6

### Patch Changes

- Updated dependencies [[`699ae1c1`](https://github.com/evmts/tevm-monorepo/commit/699ae1c19177c0d19d0b699d42d8c0024b278b7f)]:
  - @tevm/solc@1.0.0-next.6
  - @tevm/runtime@1.0.0-next.5

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

- Updated dependencies [[`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2)]:
  - @tevm/config@1.0.0-next.5
  - @tevm/runtime@1.0.0-next.5
  - @tevm/solc@1.0.0-next.5
  - @tevm/tsconfig@1.0.0-next.5

## 1.0.0-next.4

### Patch Changes

- Updated dependencies [[`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90)]:
  - @tevm/runtime@1.0.0-next.4
  - @tevm/config@1.0.0-next.4
  - @tevm/solc@1.0.0-next.4

## 1.0.0-next.3

### Patch Changes

- Updated dependencies [[`eddcef02`](https://github.com/evmts/tevm-monorepo/commit/eddcef024aebc62b713a1fd51304e12f0b093d18)]:
  - @tevm/config@1.0.0-next.3
  - @tevm/solc@1.0.0-next.3
  - @tevm/runtime@1.0.0-next.2

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/tevm-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/tevm-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to Tevm bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

### Patch Changes

- Updated dependencies [[`31ed39a5`](https://github.com/evmts/tevm-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785)]:
  - @tevm/runtime@1.0.0-next.2
  - @tevm/solc@1.0.0-next.2

## 1.0.0-next.0

### Patch Changes

- Updated dependencies [[`a8248fb5`](https://github.com/evmts/tevm-monorepo/commit/a8248fb5008594a2c5d0797780d7d033a455c442), [`32c7f253`](https://github.com/evmts/tevm-monorepo/commit/32c7f2537555380dd8c48883729add6ea658d52e), [`570c4ed6`](https://github.com/evmts/tevm-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933), [`64a404ce`](https://github.com/evmts/tevm-monorepo/commit/64a404ce56305c126847be15cf42ab14bfb38764), [`c12528a3`](https://github.com/evmts/tevm-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e), [`7065f458`](https://github.com/evmts/tevm-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033), [`747728d9`](https://github.com/evmts/tevm-monorepo/commit/747728d9e909906812472404a5f4155730127bd0), [`21ea35e3`](https://github.com/evmts/tevm-monorepo/commit/21ea35e3989ecf5d5eb2946eab96234d170fa9e5), [`2349d58c`](https://github.com/evmts/tevm-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d), [`7065f458`](https://github.com/evmts/tevm-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033)]:
  - @tevm/tsconfig@1.0.0-next.0
  - @tevm/config@1.0.0-next.0
  - @tevm/runtime@1.0.0-next.0
  - @tevm/solc@1.0.0-next.0
