# @tevm/state

## 1.0.0-next.145

### Patch Changes

- Updated dependencies [0377ad7]
  - @tevm/blockchain@1.0.0-next.145
  - @tevm/evm@1.0.0-next.145
  - @tevm/vm@1.0.0-next.145

## 1.0.0-next.144

### Patch Changes

- 93c7b32: Better TxPool.getByHash typing based on input (returns array or not), enforce unprefixed hash in TxPool.removeByHash to be consistent with other methods.
- 93c7b32: Fix events on tx added/removed from the pool:
  - remove duplicate 'txadded' event in `onChainReorganization` then `addUnverified`
  - remove 'txremoved' event in `onBlockAdded` to fire in `removeNewBlockTxs` instead

## 1.0.0-next.143

### Patch Changes

- Updated dependencies [0a2f876]
  - @tevm/vm@1.0.0-next.143

## 1.0.0-next.142

### Patch Changes

- 407646e: BUmp every package
- Updated dependencies [407646e]
  - @tevm/block@1.0.0-next.142
  - @tevm/blockchain@1.0.0-next.142
  - @tevm/common@1.0.0-next.142
  - @tevm/evm@1.0.0-next.142
  - @tevm/state@1.0.0-next.142
  - @tevm/tx@1.0.0-next.142
  - @tevm/utils@1.0.0-next.142
  - @tevm/vm@1.0.0-next.142

## 1.0.0-next.140

### Patch Changes

- @tevm/blockchain@1.0.0-next.132
- @tevm/state@1.0.0-next.140
- @tevm/evm@1.0.0-next.140
- @tevm/vm@1.0.0-next.140

## 1.0.0-next.139

### Patch Changes

- @tevm/blockchain@1.0.0-next.132
- @tevm/state@1.0.0-next.139
- @tevm/evm@1.0.0-next.139
- @tevm/vm@1.0.0-next.139

## 1.0.0-next.134

### Patch Changes

- @tevm/blockchain@1.0.0-next.132
- @tevm/state@1.0.0-next.134
- @tevm/evm@1.0.0-next.134
- @tevm/vm@1.0.0-next.134

## 1.0.0-next.132

### Patch Changes

- Updated dependencies [7ceb0c5]
  - @tevm/blockchain@1.0.0-next.132
  - @tevm/block@1.0.0-next.132
  - @tevm/state@1.0.0-next.132
  - @tevm/vm@1.0.0-next.132
  - @tevm/evm@1.0.0-next.132
  - @tevm/common@1.0.0-next.132

## 1.0.0-next.131

### Patch Changes

- e91acbc: Improved docs testcoverage and jsdoc of all packages
- Updated dependencies [e91acbc]
  - @tevm/common@1.0.0-next.131
  - @tevm/state@1.0.0-next.131
  - @tevm/utils@1.0.0-next.131
  - @tevm/evm@1.0.0-next.131
  - @tevm/vm@1.0.0-next.131
  - @tevm/block@1.0.0-next.131
  - @tevm/blockchain@1.0.0-next.131
  - @tevm/tx@1.0.0-next.131

## 1.0.0-next.130

### Patch Changes

- Updated dependencies [e962176]
  - @tevm/state@1.0.0-next.130
  - @tevm/evm@1.0.0-next.130
  - @tevm/vm@1.0.0-next.130

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages
- Updated dependencies [bc0c4a1]
  - @tevm/block@1.0.0-next.128
  - @tevm/blockchain@1.0.0-next.128
  - @tevm/common@1.0.0-next.128
  - @tevm/evm@1.0.0-next.128
  - @tevm/state@1.0.0-next.128
  - @tevm/tx@1.0.0-next.128
  - @tevm/utils@1.0.0-next.128
  - @tevm/vm@1.0.0-next.128

## 1.0.0-next.124

### Patch Changes

- @tevm/blockchain@1.0.0-next.118
- @tevm/state@1.0.0-next.124
- @tevm/evm@1.0.0-next.124
- @tevm/vm@1.0.0-next.124

## 1.0.0-next.120

### Patch Changes

- Updated dependencies [34ac999]
  - @tevm/vm@1.0.0-next.120
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/state@1.0.0-next.120
  - @tevm/evm@1.0.0-next.120

## 1.0.0-next.118

### Patch Changes

- Updated dependencies [bfba3e7]
  - @tevm/state@1.0.0-next.118
  - @tevm/utils@1.0.0-next.118
  - @tevm/evm@1.0.0-next.118
  - @tevm/vm@1.0.0-next.118
  - @tevm/block@1.0.0-next.118
  - @tevm/blockchain@1.0.0-next.118
  - @tevm/common@1.0.0-next.118
  - @tevm/tx@1.0.0-next.118

## 1.0.0-next.117

### Patch Changes

- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake
- Updated dependencies [23bb9d3]
- Updated dependencies [b53712d]
- Updated dependencies [23bb9d3]
  - @tevm/state@1.0.0-next.117
  - @tevm/blockchain@1.0.0-next.117
  - @tevm/common@1.0.0-next.117
  - @tevm/block@1.0.0-next.117
  - @tevm/utils@1.0.0-next.117
  - @tevm/evm@1.0.0-next.117
  - @tevm/tx@1.0.0-next.117
  - @tevm/vm@1.0.0-next.117

## 1.0.0-next.116

### Patch Changes

- Updated dependencies [1879fe0]
  - @tevm/common@1.0.0-next.116
  - @tevm/block@1.0.0-next.116
  - @tevm/blockchain@1.0.0-next.116
  - @tevm/evm@1.0.0-next.116
  - @tevm/state@1.0.0-next.116
  - @tevm/vm@1.0.0-next.116

## 1.0.0-next.115

### Patch Changes

- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
  - @tevm/common@1.0.0-next.115
  - @tevm/block@1.0.0-next.115
  - @tevm/blockchain@1.0.0-next.115
  - @tevm/evm@1.0.0-next.115
  - @tevm/state@1.0.0-next.115
  - @tevm/vm@1.0.0-next.115

## 1.0.0-next.110

### Patch Changes

- Updated dependencies [19370ed]
  - @tevm/blockchain@1.0.0-next.110
  - @tevm/evm@1.0.0-next.110
  - @tevm/vm@1.0.0-next.110

## 1.0.0-next.109

### Patch Changes

- Updated dependencies [da74460]
- Updated dependencies [4c9746e]
  - @tevm/common@1.0.0-next.109
  - @tevm/blockchain@1.0.0-next.109
  - @tevm/state@1.0.0-next.109
  - @tevm/utils@1.0.0-next.109
  - @tevm/evm@1.0.0-next.109
  - @tevm/tx@1.0.0-next.109
  - @tevm/vm@1.0.0-next.109
  - @tevm/block@1.0.0-next.109

## 1.0.0-next.108

### Patch Changes

- @tevm/blockchain@0.0.0-next.107
- @tevm/state@1.0.0-next.108
- @tevm/evm@1.0.0-next.108
- @tevm/vm@1.0.0-next.108

## 2.0.0-next.107

### Patch Changes

- Updated dependencies [[`4ff712a`](https://github.com/evmts/tevm-monorepo/commit/4ff712af924afdb32462aa45c10530352ae89c29)]:
  - @tevm/utils@2.0.0-next.107
  - @tevm/block@2.0.0-next.107
  - @tevm/blockchain@2.0.0-next.107
  - @tevm/common@2.0.0-next.107
  - @tevm/evm@2.0.0-next.107
  - @tevm/state@2.0.0-next.107
  - @tevm/tx@2.0.0-next.107
  - @tevm/vm@2.0.0-next.107

## 2.0.0-next.105

### Patch Changes

- Updated dependencies [[`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f), [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f)]:
  - @tevm/state@2.0.0-next.105
  - @tevm/blockchain@2.0.0-next.105
  - @tevm/common@2.0.0-next.105
  - @tevm/utils@2.0.0-next.105
  - @tevm/evm@2.0.0-next.105
  - @tevm/vm@2.0.0-next.105
  - @tevm/block@2.0.0-next.105
  - @tevm/tx@2.0.0-next.105

## 2.0.0-next.103

### Patch Changes

- Updated dependencies []:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.103
  - @tevm/evm@2.0.0-next.103
  - @tevm/vm@2.0.0-next.103

## 2.0.0-next.102

### Patch Changes

- Updated dependencies []:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.102
  - @tevm/evm@2.0.0-next.102
  - @tevm/vm@2.0.0-next.102

## 2.0.0-next.101

### Patch Changes

- Updated dependencies []:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/state@2.0.0-next.101
  - @tevm/evm@2.0.0-next.101
  - @tevm/vm@2.0.0-next.101

## 1.1.0-next.100

### Patch Changes

- [#1322](https://github.com/evmts/tevm-monorepo/pull/1322) [`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated to vitest for better coverage reporting

- Updated dependencies [[`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5), [`fb42620`](https://github.com/evmts/tevm-monorepo/commit/fb4262025f58d627bd96df95b757ab3f7e2f2131), [`1028d01`](https://github.com/evmts/tevm-monorepo/commit/1028d01f546938f16db73f012a33626cc71fa9ca), [`fb42620`](https://github.com/evmts/tevm-monorepo/commit/fb4262025f58d627bd96df95b757ab3f7e2f2131)]:
  - @tevm/blockchain@1.1.0-next.100
  - @tevm/common@1.1.0-next.100
  - @tevm/block@1.1.0-next.100
  - @tevm/state@1.1.0-next.100
  - @tevm/utils@1.1.0-next.100
  - @tevm/evm@1.1.0-next.100
  - @tevm/tx@1.1.0-next.100
  - @tevm/vm@1.1.0-next.100

## 1.1.0-next.99

### Minor Changes

- [#1312](https://github.com/evmts/tevm-monorepo/pull/1312) [`a8c810b`](https://github.com/evmts/tevm-monorepo/commit/a8c810b87f682fb3504e6db8a0ace6ef4220e842) Thanks [@roninjin10](https://github.com/roninjin10)! - Add deepCopy method to BaseClient ReceiptManager and TxPool

### Patch Changes

- Updated dependencies [[`c71445a`](https://github.com/evmts/tevm-monorepo/commit/c71445a1aa729f079737ff8e53bc8b39cb70d37b)]:
  - @tevm/blockchain@1.1.0-next.99
  - @tevm/evm@1.1.0-next.99
  - @tevm/vm@1.1.0-next.99

## 1.1.0-next.97

### Patch Changes

- Updated dependencies [[`277ed48`](https://github.com/evmts/tevm-monorepo/commit/277ed48697e1e094af5ee8bed0955c823123570e), [`e19fc84`](https://github.com/evmts/tevm-monorepo/commit/e19fc84037a72a7c2bc0dd60f6a8841a28a5f99e)]:
  - @tevm/utils@1.1.0-next.97
  - @tevm/block@1.1.0-next.97
  - @tevm/tx@1.1.0-next.97
  - @tevm/vm@1.1.0-next.97

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

- Updated dependencies [[`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6)]:
  - @tevm/block@1.1.0-next.96
  - @tevm/utils@1.1.0-next.96
  - @tevm/tx@1.1.0-next.96
  - @tevm/vm@1.1.0-next.96

## 1.1.0-next.95

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.95

## 1.1.0-next.94

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.94

## 1.1.0-next.92

### Patch Changes

- Updated dependencies [[`7af1917`](https://github.com/evmts/tevm-monorepo/commit/7af1917c2cedfed22f62f3e6edf3e6e15a8b7ac8)]:
  - @tevm/utils@1.1.0-next.92
  - @tevm/block@1.1.0-next.92
  - @tevm/tx@1.1.0-next.92
  - @tevm/vm@1.1.0-next.92

## 1.1.0-next.91

### Patch Changes

- Updated dependencies [[`7216932`](https://github.com/evmts/tevm-monorepo/commit/72169323bb89aba7165fcbedae7d024c71664333)]:
  - @tevm/utils@1.1.0-next.91
  - @tevm/block@1.1.0-next.91
  - @tevm/tx@1.1.0-next.91
  - @tevm/vm@1.1.0-next.91

## 1.1.0-next.90

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.90

## 1.1.0-next.88

### Patch Changes

- Updated dependencies [[`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`a3a8437`](https://github.com/evmts/tevm-monorepo/commit/a3a843794d11e1bec86e3747c1d07d91de53ee54), [`e6f57e8`](https://github.com/evmts/tevm-monorepo/commit/e6f57e8ec4765b0520c850cff92370de50b1cc47), [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60), [`0136b52`](https://github.com/evmts/tevm-monorepo/commit/0136b528fade3f557406ee52d24be35cfc2a752c)]:
  - @tevm/vm@1.1.0-next.88
  - @tevm/utils@1.1.0-next.88
  - @tevm/block@1.1.0-next.88
  - @tevm/tx@1.1.0-next.88

## 2.0.0-next.86

### Patch Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Bumped sub dep up

- Updated dependencies [[`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8)]:
  - @tevm/block@2.0.0-next.86
  - @tevm/utils@2.0.0-next.86
  - @tevm/tx@2.0.0-next.86
  - @tevm/vm@2.0.0-next.86

## 2.0.0-next.85

### Patch Changes

- Updated dependencies []:
  - @tevm/block@2.0.0-next.85
  - @tevm/vm@2.0.0-next.85

## 2.0.0-next.84

### Patch Changes

- Updated dependencies [[`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd)]:
  - @tevm/utils@2.0.0-next.84
  - @tevm/block@2.0.0-next.84
  - @tevm/tx@2.0.0-next.84
  - @tevm/vm@2.0.0-next.84

## 2.0.0-next.83

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@2.0.0-next.83

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

- Updated dependencies [[`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d)]:
  - @tevm/block@2.0.0-next.80
  - @tevm/tx@2.0.0-next.80
  - @tevm/utils@2.0.0-next.80
  - @tevm/vm@2.0.0-next.80

## 2.0.0-next.79

### Patch Changes

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

- Updated dependencies [[`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d), [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911), [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81)]:
  - @tevm/utils@2.0.0-next.79
  - @tevm/block@2.0.0-next.79
  - @tevm/tx@2.0.0-next.79
  - @tevm/vm@2.0.0-next.79

## 1.1.0-next.78

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.78

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

- Updated dependencies [[`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d)]:
  - @tevm/block@1.1.0-next.77
  - @tevm/tx@1.1.0-next.77
  - @tevm/utils@1.1.0-next.77
  - @tevm/vm@1.1.0-next.77

## 1.1.0-next.76

### Patch Changes

- Updated dependencies [[`4650d32`](https://github.com/evmts/tevm-monorepo/commit/4650d32e2ee03f6ffc3cecbedec0b079b44f2081)]:
  - @tevm/tx@1.1.0-next.76
  - @tevm/vm@1.1.0-next.76
  - @tevm/block@1.1.0-next.76

## 1.1.0-next.75

### Patch Changes

- Updated dependencies [[`db7bfc7`](https://github.com/evmts/tevm-monorepo/commit/db7bfc7bac341e29e2df20569347eb019e2d37a7)]:
  - @tevm/utils@1.1.0-next.75
  - @tevm/block@1.1.0-next.75
  - @tevm/tx@1.1.0-next.75
  - @tevm/vm@1.1.0-next.75

## 1.1.0-next.74

### Minor Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

- Updated dependencies [[`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a)]:
  - @tevm/block@1.1.0-next.74
  - @tevm/utils@1.1.0-next.74
  - @tevm/tx@1.1.0-next.74
  - @tevm/vm@1.1.0-next.74

## 1.1.0-next.73

### Patch Changes

- Updated dependencies []:
  - @tevm/vm@1.1.0-next.73

## 1.1.0-next.72

### Minor Changes

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

### Patch Changes

- Updated dependencies [[`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32), [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa)]:
  - @tevm/utils@1.1.0-next.72
  - @tevm/vm@1.1.0-next.72
  - @tevm/tx@1.1.0-next.72
  - @tevm/block@1.1.0-next.72

## 1.1.0-next.70

### Patch Changes

- [#1170](https://github.com/evmts/tevm-monorepo/pull/1170) [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved viem to a peer dependency

- Updated dependencies [[`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113)]:
  - @tevm/utils@1.1.0-next.70
  - @tevm/vm@1.1.0-next.70
  - @tevm/block@1.1.0-next.70
  - @tevm/tx@1.1.0-next.70

## 1.1.0-next.69

### Patch Changes

- [#1163](https://github.com/evmts/tevm-monorepo/pull/1163) [`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bad publish

- Updated dependencies [[`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e)]:
  - @tevm/block@1.1.0-next.69
  - @tevm/tx@1.1.0-next.69
  - @tevm/utils@1.1.0-next.69

## 1.1.0-next.62

### Patch Changes

- Updated dependencies []:
  - @tevm/block@1.1.0-next.62

## 1.1.0-next.60

### Patch Changes

- [#1127](https://github.com/evmts/tevm-monorepo/pull/1127) [`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bad release from lack of changeset

- Updated dependencies [[`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6)]:
  - @tevm/block@1.1.0-next.60
  - @tevm/tx@1.1.0-next.60
  - @tevm/utils@1.1.0-next.60

## 1.1.0-next.59

### Patch Changes

- Updated dependencies [[`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82)]:
  - @tevm/block@1.1.0-next.59

## 1.1.0-next.57

### Patch Changes

- Updated dependencies []:
  - @tevm/block@1.1.0-next.57

## 1.1.0-next.56

### Patch Changes

- Updated dependencies [[`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784)]:
  - @tevm/block@1.1.0-next.56

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/block@1.1.0-next.52
  - @tevm/tx@1.1.0-next.52
  - @tevm/utils@1.1.0-next.52

## 1.1.0-next.49

### Minor Changes

- [#1074](https://github.com/evmts/tevm-monorepo/pull/1074) [`2ba2c27`](https://github.com/evmts/tevm-monorepo/commit/2ba2c278c11e524a7fbb0a8201e7f82c8ec9a4f5) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bySenderAddress method to return all mempool tx from a single sender address

### Patch Changes

- [#1076](https://github.com/evmts/tevm-monorepo/pull/1076) [`40547fe`](https://github.com/evmts/tevm-monorepo/commit/40547fe96681c4d590b99c50350d86e0197e10c8) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with txPool not removing processed tx after block is mined

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/block@1.1.0-next.47
  - @tevm/tx@1.1.0-next.47
  - @tevm/utils@1.1.0-next.47

## 1.1.0-next.46

### Patch Changes

- Updated dependencies []:
  - @tevm/block@1.1.0-next.46

## 1.1.0-next.45

### Patch Changes

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

- [#985](https://github.com/evmts/tevm-monorepo/pull/985) [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all deps to latest version

- Updated dependencies [[`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921)]:
  - @tevm/block@1.1.0-next.45
  - @tevm/utils@1.1.0-next.45
  - @tevm/tx@1.1.0-next.45

## 1.0.0-next.42

### Patch Changes

- Updated dependencies [[`0f4bcdb340b86deb5523ba3b63f03df8d2a134f6`](https://github.com/evmts/tevm-monorepo/commit/0f4bcdb340b86deb5523ba3b63f03df8d2a134f6)]:
  - @tevm/blockchain@1.0.0-next.42
  - @tevm/evm@1.0.0-next.42

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/blockchain@1.0.0-next.40
  - @tevm/common@1.0.0-next.40
  - @tevm/evm@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/blockchain@1.0.0-next.39
  - @tevm/common@1.0.0-next.39
  - @tevm/evm@1.0.0-next.39

## 1.0.0-next.37

### Minor Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/vm package to wrap the ethereumjs vm with a TevmVm class that handles custom tevm functionality

## 1.0.0-next.30

### Minor Changes

- [#900](https://github.com/evmts/tevm-monorepo/pull/900) [`d3d2f0f3322ac476347151840cd0ee42a5a18c56`](https://github.com/evmts/tevm-monorepo/commit/d3d2f0f3322ac476347151840cd0ee42a5a18c56) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new `proxy mode` to tevm. Proxy mode is similar to forked mode but will track the latest block

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

## 1.0.0-next.22

### Minor Changes

- [#805](https://github.com/evmts/tevm-monorepo/pull/805) [`8b3218b1`](https://github.com/evmts/tevm-monorepo/commit/8b3218b129ed43cf173a369cbe6b636365748e77) Thanks [@0xNonCents](https://github.com/0xNonCents)! - Enable State Load and Dump actions

## 1.0.0-next.21

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added @tevm/state package. This custom ethereumjs state implemenation powers the Tevm VM
