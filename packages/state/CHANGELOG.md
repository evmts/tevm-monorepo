# @tevm/state

## 1.0.0-next.134

### Patch Changes

- @tevm/test-utils@1.0.0-next.134

## 1.0.0-next.132

### Patch Changes

- 7ceb0c5: Added missing jsdoc to all packages
- Updated dependencies [7ceb0c5]
  - @tevm/logger@1.0.0-next.132
  - @tevm/test-utils@1.0.0-next.132
  - @tevm/common@1.0.0-next.132

## 1.0.0-next.131

### Patch Changes

- e91acbc: Improved docs testcoverage and jsdoc of all packages
- Updated dependencies [e91acbc]
  - @tevm/common@1.0.0-next.131
  - @tevm/errors@1.0.0-next.131
  - @tevm/utils@1.0.0-next.131
  - @tevm/address@1.0.0-next.131
  - @tevm/logger@1.0.0-next.131
  - @tevm/test-utils@1.0.0-next.131

## 1.0.0-next.130

### Minor Changes

- e962176: Improved performance by persisting fork cache across VM instances:

  - Modified `deepCopy.js` and `shallowCopy.js` to share the fork cache object reference between original and copied state
  - Implemented hierarchical cache lookup: first check main cache, then fork cache, then fetch from remote provider
  - Stores data fetched from remote providers in both caches for future access
  - Eliminated redundant remote provider calls when using cloned VMs
  - Significantly reduced network latency for transaction simulations and gas estimations
  - Maintained complete type safety and backward compatibility
  - Enhanced documentation explaining the fork cache persistence approach
  - Added tests to verify proper cache sharing behavior

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages
- Updated dependencies [bc0c4a1]
  - @tevm/address@1.0.0-next.128
  - @tevm/common@1.0.0-next.128
  - @tevm/errors@1.0.0-next.128
  - @tevm/logger@1.0.0-next.128
  - @tevm/utils@1.0.0-next.128
  - @tevm/test-utils@1.0.0-next.128

## 1.0.0-next.124

### Patch Changes

- @tevm/test-utils@1.0.0-next.124

## 1.0.0-next.120

### Patch Changes

- Updated dependencies [34ac999]
  - @tevm/test-utils@1.0.0-next.120

## 1.0.0-next.118

### Patch Changes

- bfba3e7: Updated every dependency in entire tevm monorepo to latest
- Updated dependencies [bfba3e7]
  - @tevm/errors@1.0.0-next.118
  - @tevm/logger@1.0.0-next.118
  - @tevm/test-utils@1.0.0-next.118
  - @tevm/utils@1.0.0-next.118
  - @tevm/address@1.0.0-next.118
  - @tevm/common@1.0.0-next.118

## 1.0.0-next.117

### Patch Changes

- 23bb9d3: Fixed race condition in getTransactionCount
- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake
- Updated dependencies [5ff4b12]
- Updated dependencies [ec30a0e]
- Updated dependencies [b53712d]
- Updated dependencies [23bb9d3]
  - @tevm/address@1.0.0-next.117
  - @tevm/errors@1.0.0-next.117
  - @tevm/common@1.0.0-next.117
  - @tevm/logger@1.0.0-next.117
  - @tevm/test-utils@1.0.0-next.117
  - @tevm/utils@1.0.0-next.117

## 1.0.0-next.116

### Patch Changes

- Updated dependencies [1879fe0]
  - @tevm/common@1.0.0-next.116

## 1.0.0-next.115

### Patch Changes

- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
- Updated dependencies [144fc64]
  - @tevm/common@1.0.0-next.115

## 1.0.0-next.109

### Patch Changes

- 4c9746e: Upgrade all dependencies to latest
- Updated dependencies [da74460]
- Updated dependencies [4c9746e]
  - @tevm/common@1.0.0-next.109
  - @tevm/address@1.0.0-next.109
  - @tevm/errors@1.0.0-next.109
  - @tevm/logger@1.0.0-next.109
  - @tevm/test-utils@1.0.0-next.109
  - @tevm/utils@1.0.0-next.109

## 1.0.0-next.108

### Patch Changes

- @tevm/test-utils@1.0.0-next.108

## 2.0.0-next.107

### Patch Changes

- Updated dependencies [[`4ff712a`](https://github.com/evmts/tevm-monorepo/commit/4ff712af924afdb32462aa45c10530352ae89c29)]:
  - @tevm/utils@2.0.0-next.107
  - @tevm/address@2.0.0-next.107
  - @tevm/common@2.0.0-next.107
  - @tevm/test-utils@2.0.0-next.107

## 2.0.0-next.105

### Minor Changes

- [#1370](https://github.com/evmts/tevm-monorepo/pull/1370) [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed tevm/base-client to tevm/node

### Patch Changes

- [#1370](https://github.com/evmts/tevm-monorepo/pull/1370) [`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where state manager wouldn't set the code hash when modifying deployedBytecode

- Updated dependencies [[`1dcfd69`](https://github.com/evmts/tevm-monorepo/commit/1dcfd6944f77493a00daa0d64590c2b0c0983a0f)]:
  - @tevm/address@2.0.0-next.105
  - @tevm/common@2.0.0-next.105
  - @tevm/errors@2.0.0-next.105
  - @tevm/utils@2.0.0-next.105
  - @tevm/test-utils@2.0.0-next.105

## 2.0.0-next.103

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@2.0.0-next.103

## 2.0.0-next.102

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@2.0.0-next.102

## 2.0.0-next.101

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@2.0.0-next.101

## 1.1.0-next.100

### Patch Changes

- [#1322](https://github.com/evmts/tevm-monorepo/pull/1322) [`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated to vitest for better coverage reporting

- Updated dependencies [[`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5)]:
  - @tevm/address@1.1.0-next.100
  - @tevm/common@1.1.0-next.100
  - @tevm/errors@1.1.0-next.100
  - @tevm/logger@1.1.0-next.100
  - @tevm/utils@1.1.0-next.100
  - @tevm/test-utils@1.1.0-next.100

## 1.1.0-next.97

### Patch Changes

- Updated dependencies [[`277ed48`](https://github.com/evmts/tevm-monorepo/commit/277ed48697e1e094af5ee8bed0955c823123570e), [`e19fc84`](https://github.com/evmts/tevm-monorepo/commit/e19fc84037a72a7c2bc0dd60f6a8841a28a5f99e)]:
  - @tevm/utils@1.1.0-next.97
  - @tevm/address@1.1.0-next.97
  - @tevm/common@1.1.0-next.97
  - @tevm/test-utils@1.1.0-next.97

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

- Updated dependencies [[`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6)]:
  - @tevm/address@1.1.0-next.96
  - @tevm/common@1.1.0-next.96
  - @tevm/errors@1.1.0-next.96
  - @tevm/logger@1.1.0-next.96
  - @tevm/test-utils@1.1.0-next.96
  - @tevm/utils@1.1.0-next.96

## 1.1.0-next.95

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@1.1.0-next.95

## 1.1.0-next.94

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@1.1.0-next.94

## 1.1.0-next.92

### Patch Changes

- Updated dependencies [[`7af1917`](https://github.com/evmts/tevm-monorepo/commit/7af1917c2cedfed22f62f3e6edf3e6e15a8b7ac8)]:
  - @tevm/utils@1.1.0-next.92
  - @tevm/address@1.1.0-next.92
  - @tevm/common@1.1.0-next.92
  - @tevm/test-utils@1.1.0-next.92

## 1.1.0-next.91

### Patch Changes

- Updated dependencies [[`7216932`](https://github.com/evmts/tevm-monorepo/commit/72169323bb89aba7165fcbedae7d024c71664333)]:
  - @tevm/utils@1.1.0-next.91
  - @tevm/common@1.1.0-next.91
  - @tevm/test-utils@1.1.0-next.91

## 1.1.0-next.90

### Minor Changes

- [#1268](https://github.com/evmts/tevm-monorepo/pull/1268) [`396157c`](https://github.com/evmts/tevm-monorepo/commit/396157c8ee742fcabeb768ba737c37a400908e3f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added options to configure and pass in custom caches. For example caches that prune old state sooner

## 1.1.0-next.88

### Patch Changes

- [#1252](https://github.com/evmts/tevm-monorepo/pull/1252) [`c91776e`](https://github.com/evmts/tevm-monorepo/commit/c91776e12e72b31f8c05f936f6969b3c8c67ba60) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed closure bug which would cause StateManager.dumpStorage to dump the wrong storage. This caused getAccount downstream to sometimes falsely return empty storage

- Updated dependencies [[`e6f57e8`](https://github.com/evmts/tevm-monorepo/commit/e6f57e8ec4765b0520c850cff92370de50b1cc47), [`0136b52`](https://github.com/evmts/tevm-monorepo/commit/0136b528fade3f557406ee52d24be35cfc2a752c)]:
  - @tevm/utils@1.1.0-next.88
  - @tevm/common@1.1.0-next.88
  - @tevm/test-utils@1.1.0-next.88

## 2.0.0-next.86

### Patch Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Bumped sub dep up

- Updated dependencies [[`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8)]:
  - @tevm/common@2.0.0-next.86
  - @tevm/errors@2.0.0-next.86
  - @tevm/logger@2.0.0-next.86
  - @tevm/test-utils@2.0.0-next.86
  - @tevm/utils@2.0.0-next.86

## 2.0.0-next.85

### Patch Changes

- Updated dependencies [[`8de7d8c`](https://github.com/evmts/tevm-monorepo/commit/8de7d8cab488c61b8c91c62cabb7a428c70beeb1)]:
  - @tevm/common@2.0.0-next.85

## 2.0.0-next.84

### Patch Changes

- Updated dependencies [[`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd), [`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd)]:
  - @tevm/errors@2.0.0-next.84
  - @tevm/utils@2.0.0-next.84
  - @tevm/common@2.0.0-next.84
  - @tevm/test-utils@2.0.0-next.84

## 2.0.0-next.83

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@2.0.0-next.83

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

- Updated dependencies [[`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d)]:
  - @tevm/common@2.0.0-next.80
  - @tevm/errors@2.0.0-next.80
  - @tevm/logger@2.0.0-next.80
  - @tevm/utils@2.0.0-next.80
  - @tevm/test-utils@2.0.0-next.80

## 2.0.0-next.79

### Minor Changes

- [#1210](https://github.com/evmts/tevm-monorepo/pull/1210) [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911) Thanks [@roninjin10](https://github.com/roninjin10)! - Add compatability for viem code property

### Patch Changes

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug in dumpStorage where state was not being properly prefixed with 0x for keys

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Update all packages for new tevm contract changes"

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

- Updated dependencies [[`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3), [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d), [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911), [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81)]:
  - @tevm/common@2.0.0-next.79
  - @tevm/errors@2.0.0-next.79
  - @tevm/test-utils@2.0.0-next.79
  - @tevm/utils@2.0.0-next.79
  - @tevm/logger@2.0.0-next.79

## 1.1.0-next.78

### Patch Changes

- Updated dependencies [[`cae3703`](https://github.com/evmts/tevm-monorepo/commit/cae370392e9633a06503957fbc96e6508dbcb0c5)]:
  - @tevm/test-utils@1.1.0-next.78

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

- Updated dependencies [[`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d)]:
  - @tevm/common@1.1.0-next.77
  - @tevm/errors@1.1.0-next.77
  - @tevm/logger@1.1.0-next.77
  - @tevm/utils@1.1.0-next.77
  - @tevm/test-utils@1.1.0-next.77

## 1.1.0-next.75

### Patch Changes

- Updated dependencies [[`db7bfc7`](https://github.com/evmts/tevm-monorepo/commit/db7bfc7bac341e29e2df20569347eb019e2d37a7)]:
  - @tevm/errors@1.1.0-next.75
  - @tevm/utils@1.1.0-next.75
  - @tevm/common@1.1.0-next.75
  - @tevm/test-utils@1.1.0-next.75

## 1.1.0-next.74

### Minor Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

- Updated dependencies [[`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a), [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a)]:
  - @tevm/common@1.1.0-next.74
  - @tevm/errors@1.1.0-next.74
  - @tevm/utils@1.1.0-next.74
  - @tevm/logger@1.1.0-next.74
  - @tevm/test-utils@1.1.0-next.74

## 1.1.0-next.73

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@1.1.0-next.73

## 1.1.0-next.72

### Minor Changes

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more opstack gas information

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

- [#1174](https://github.com/evmts/tevm-monorepo/pull/1174) [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa) Thanks [@roninjin10](https://github.com/roninjin10)! - Add support for stateManager.getAppliedKey

### Patch Changes

- [#1177](https://github.com/evmts/tevm-monorepo/pull/1177) [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies to latest

- Updated dependencies [[`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32), [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5), [`17a3ea3`](https://github.com/evmts/tevm-monorepo/commit/17a3ea3715fbce4767aee444ec6b5d995d37c6aa), [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5)]:
  - @tevm/utils@1.1.0-next.72
  - @tevm/test-utils@1.1.0-next.72
  - @tevm/common@1.1.0-next.72
  - @tevm/logger@1.1.0-next.72

## 1.1.0-next.70

### Patch Changes

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated viem to latest

- [#1170](https://github.com/evmts/tevm-monorepo/pull/1170) [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved viem to a peer dependency

- Updated dependencies [[`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8), [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113)]:
  - @tevm/common@1.1.0-next.70
  - @tevm/test-utils@1.1.0-next.70
  - @tevm/utils@1.1.0-next.70

## 1.1.0-next.69

### Patch Changes

- [#1163](https://github.com/evmts/tevm-monorepo/pull/1163) [`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bad publish

- Updated dependencies [[`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e)]:
  - @tevm/common@1.1.0-next.69
  - @tevm/logger@1.1.0-next.69
  - @tevm/utils@1.1.0-next.69
  - @tevm/test-utils@1.1.0-next.69

## 1.1.0-next.66

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@1.1.0-next.66

## 1.1.0-next.65

### Patch Changes

- Updated dependencies []:
  - @tevm/test-utils@1.1.0-next.65

## 1.1.0-next.63

### Patch Changes

- [#1143](https://github.com/evmts/tevm-monorepo/pull/1143) [`b3d1468`](https://github.com/evmts/tevm-monorepo/commit/b3d1468c06d254b6ccad2df2d7f51231489c6000) Thanks [@roninjin10](https://github.com/roninjin10)! - Made major improvements to tevm performance

  before: 2.38s
  after: 0.83s

  before: 6.69s
  after: 0.683s

  before: 8.42s
  after: 0.219s

  before: 4.07s
  after: 0.01s

## 1.1.0-next.62

### Patch Changes

- Updated dependencies [[`1676394`](https://github.com/evmts/tevm-monorepo/commit/1676394b6f2883220dfbe4aa3dd52cf5de3222b2), [`efc5998`](https://github.com/evmts/tevm-monorepo/commit/efc5998db8b0f90cd68e6d7fc906826a4b55951c)]:
  - @tevm/common@1.1.0-next.62
  - @tevm/test-utils@1.1.0-next.62

## 1.1.0-next.60

### Patch Changes

- [#1127](https://github.com/evmts/tevm-monorepo/pull/1127) [`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bad release from lack of changeset

- Updated dependencies [[`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6)]:
  - @tevm/common@1.1.0-next.60
  - @tevm/logger@1.1.0-next.60
  - @tevm/utils@1.1.0-next.60
  - @tevm/test-utils@1.1.0-next.60

## 1.1.0-next.59

### Patch Changes

- Updated dependencies [[`265fc45`](https://github.com/evmts/tevm-monorepo/commit/265fc4542cf9ceffb133443606c474c8bb5e3c82)]:
  - @tevm/common@1.1.0-next.59

## 1.1.0-next.57

### Patch Changes

- Updated dependencies [[`72ba692`](https://github.com/evmts/tevm-monorepo/commit/72ba6927ed30c54caeede41e9ea7096c9551ae59)]:
  - @tevm/common@1.1.0-next.57

## 1.1.0-next.56

### Patch Changes

- Updated dependencies [[`9eeba47`](https://github.com/evmts/tevm-monorepo/commit/9eeba478f249b8c1bf654607206b61f95c9c9784)]:
  - @tevm/test-utils@1.1.0-next.56

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/common@1.1.0-next.52
  - @tevm/logger@1.1.0-next.52
  - @tevm/utils@1.1.0-next.52
  - @tevm/test-utils@1.1.0-next.52

## 1.1.0-next.51

### Patch Changes

- [#1084](https://github.com/evmts/tevm-monorepo/pull/1084) [`93b04d6`](https://github.com/evmts/tevm-monorepo/commit/93b04d6a3cd06180e3567d07bec655c7a135a8c3) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with empty accounts not being returned empty in statemanager when in forked mode. This bug would affect both gas estimation and contract creation

## 1.1.0-next.49

### Patch Changes

- [#1076](https://github.com/evmts/tevm-monorepo/pull/1076) [`40547fe`](https://github.com/evmts/tevm-monorepo/commit/40547fe96681c4d590b99c50350d86e0197e10c8) Thanks [@roninjin10](https://github.com/roninjin10)! - Cleaned up how deep copying works. Change should help with performance a bit.

- Updated dependencies [[`3546dc4`](https://github.com/evmts/tevm-monorepo/commit/3546dc42267a66f1b80f0422547867c653724f5d)]:
  - @tevm/test-utils@1.1.0-next.49

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/test-utils@1.1.0-next.47
  - @tevm/common@1.1.0-next.47
  - @tevm/logger@1.1.0-next.47
  - @tevm/utils@1.1.0-next.47

## 1.1.0-next.46

### Patch Changes

- [#1057](https://github.com/evmts/tevm-monorepo/pull/1057) [`2a7e1db`](https://github.com/evmts/tevm-monorepo/commit/2a7e1db74c68f8e803026b95a1ce957445db1388) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bug with not allowign genesisstate with no state roots

- Updated dependencies [[`4da1830`](https://github.com/evmts/tevm-monorepo/commit/4da1830d2c0df764156b79f12508d11702694b3d)]:
  - @tevm/common@1.1.0-next.46

## 1.1.0-next.45

### Patch Changes

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

- [#985](https://github.com/evmts/tevm-monorepo/pull/985) [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all deps to latest version

- [#1018](https://github.com/evmts/tevm-monorepo/pull/1018) [`7c172f9`](https://github.com/evmts/tevm-monorepo/commit/7c172f9da63c490e89f93b831309e4f0183e8da7) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with state not correctly replicating itself in #1016

- Updated dependencies [[`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921)]:
  - @tevm/common@1.1.0-next.45
  - @tevm/utils@1.1.0-next.45

## 1.0.0-next.40

### Minor Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Renamed serializableTevmState TevmState. SerializableTevmState is now JSON-serializable

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/utils@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/utils@1.0.0-next.39

## 1.0.0-next.37

### Minor Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Adds new deepCopy props to the tevm state managers

### Patch Changes

- [#931](https://github.com/evmts/tevm-monorepo/pull/931) [`e83ef5bea0f79def27d59115719427aea3c91888`](https://github.com/evmts/tevm-monorepo/commit/e83ef5bea0f79def27d59115719427aea3c91888) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with load storage incorrectly hashing storage value

## 1.0.0-next.36

### Patch Changes

- [#936](https://github.com/evmts/tevm-monorepo/pull/936) [`4e1c6af34b2262fc56a68528f435958e62b0a947`](https://github.com/evmts/tevm-monorepo/commit/4e1c6af34b2262fc56a68528f435958e62b0a947) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bug with debug module by removing it completely

## 1.0.0-next.35

### Patch Changes

- [#934](https://github.com/evmts/tevm-monorepo/pull/934) [`aa6b7a03f0490809e15176c832b48495921913c9`](https://github.com/evmts/tevm-monorepo/commit/aa6b7a03f0490809e15176c832b48495921913c9) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with debug being an ESM only package via bundling it.

## 1.0.0-next.33

### Minor Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated tevm call actions to not modify the state by default unless createTransaction: true is set

- [#891](https://github.com/evmts/tevm-monorepo/pull/891) [`7453edc4231d597179cc9bb117bc5df488b99c51`](https://github.com/evmts/tevm-monorepo/commit/7453edc4231d597179cc9bb117bc5df488b99c51) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved state dump and state load to generateCannonicalGenesis and dumpCanonicalGenesis methods on state classes

### Patch Changes

- [#890](https://github.com/evmts/tevm-monorepo/pull/890) [`64db695b4bf00b1e06909b960e9a498e520f1d73`](https://github.com/evmts/tevm-monorepo/commit/64db695b4bf00b1e06909b960e9a498e520f1d73) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with state normal mode not shallow copying correctly

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
