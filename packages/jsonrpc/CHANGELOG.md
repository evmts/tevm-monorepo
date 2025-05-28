# @tevm/jsonrpc

## 1.0.0-next.146

### Patch Changes

- c1a3cda: pnpm up --latest all packages

## 1.0.0-next.142

### Patch Changes

- 407646e: BUmp every package

## 1.0.0-next.131

### Patch Changes

- e91acbc: Improved docs testcoverage and jsdoc of all packages

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages

## 1.0.0-next.118

### Patch Changes

- bfba3e7: Updated every dependency in entire tevm monorepo to latest

## 1.0.0-next.117

### Patch Changes

- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake

## 1.0.0-next.109

### Patch Changes

- 4c9746e: Upgrade all dependencies to latest

## 1.1.0-next.100

### Patch Changes

- [#1322](https://github.com/evmts/tevm-monorepo/pull/1322) [`6407be7`](https://github.com/evmts/tevm-monorepo/commit/6407be7736c996aa8939a0ec5ee13c3d3c34f1e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated to vitest for better coverage reporting

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

## 2.0.0-next.86

### Patch Changes

- [#1240](https://github.com/evmts/tevm-monorepo/pull/1240) [`b1f0504`](https://github.com/evmts/tevm-monorepo/commit/b1f0504a6be9abf08faa029e7b40fb53666293e8) Thanks [@roninjin10](https://github.com/roninjin10)! - Bumped sub dep up

## 2.0.0-next.84

### Patch Changes

- [#1232](https://github.com/evmts/tevm-monorepo/pull/1232) [`a170f0f`](https://github.com/evmts/tevm-monorepo/commit/a170f0f05a624f70cadea95f4fbaf11c00d5cadd) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issues with error handling and added unit testing

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

## 2.0.0-next.79

### Minor Changes

- [#1210](https://github.com/evmts/tevm-monorepo/pull/1210) [`f2d4ac4`](https://github.com/evmts/tevm-monorepo/commit/f2d4ac43dab0c5affe994985851639438cb05911) Thanks [@roninjin10](https://github.com/roninjin10)! - Add compatability for viem code property

### Patch Changes

- [#1211](https://github.com/evmts/tevm-monorepo/pull/1211) [`f51ef40`](https://github.com/evmts/tevm-monorepo/commit/f51ef4007f53b2ca6d4ebff770104d9e9f462ea3) Thanks [@roninjin10](https://github.com/roninjin10)! - Update all packages for new tevm contract changes"

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

- [#1213](https://github.com/evmts/tevm-monorepo/pull/1213) [`84a6d9c`](https://github.com/evmts/tevm-monorepo/commit/84a6d9caae5e72246933d72e8721d466b238cf81) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies except effect to latest

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

## 1.1.0-next.74

### Minor Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Implemented new typesafe error system based on viem errors and the JSON-RPC spec for error codes. All errors come with a typesafe `name` property along with link to docs about the error. They also have a `code` property that maps to ethereum JSON-RPC error codes. All concrete errors are implemented in the `@tevm/errors` package. Each function will then export a union error type of all the errors it and it's sub-functions can throw.

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

## 1.1.0-next.72

### Minor Changes

- [#1175](https://github.com/evmts/tevm-monorepo/pull/1175) [`719e083`](https://github.com/evmts/tevm-monorepo/commit/719e0837fe56e61cb7c9b19152a943e664a4ebf5) Thanks [@roninjin10](https://github.com/roninjin10)! - Added more opstack gas information

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

### Patch Changes

- [#1177](https://github.com/evmts/tevm-monorepo/pull/1177) [`3a06dbd`](https://github.com/evmts/tevm-monorepo/commit/3a06dbd3892dff10436741a03364d37b763f3c32) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies to latest

## 1.1.0-next.70

### Patch Changes

- [#1166](https://github.com/evmts/tevm-monorepo/pull/1166) [`60f3276`](https://github.com/evmts/tevm-monorepo/commit/60f3276a241935b4756f4adf2531d5fabce520a8) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated viem to latest

- [#1170](https://github.com/evmts/tevm-monorepo/pull/1170) [`ee1a52d`](https://github.com/evmts/tevm-monorepo/commit/ee1a52d0be3e91b1b9667226cc32d54d87221113) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved viem to a peer dependency

## 1.1.0-next.69

### Patch Changes

- [#1163](https://github.com/evmts/tevm-monorepo/pull/1163) [`eb80103`](https://github.com/evmts/tevm-monorepo/commit/eb80103442991a0bbe8342f1e237cb52b1a8cc9e) Thanks [@roninjin10](https://github.com/roninjin10)! - Fix bad publish

## 1.1.0-next.60

### Patch Changes

- [#1127](https://github.com/evmts/tevm-monorepo/pull/1127) [`1314a07`](https://github.com/evmts/tevm-monorepo/commit/1314a0770007dd3aa8a4762ddbec62ac60c1dfb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bad release from lack of changeset

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

## 1.1.0-next.46

### Minor Changes

- [#1063](https://github.com/evmts/tevm-monorepo/pull/1063) [`413533d`](https://github.com/evmts/tevm-monorepo/commit/413533de36b359711253ba6918afcb1363ec14bc) Thanks [@roninjin10](https://github.com/roninjin10)! - Added retry support to JSON-RPC

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

## 1.0.0-next.23

### Minor Changes

- [#847](https://github.com/evmts/tevm-monorepo/pull/847) [`de81ac31460bb642dad401571ad3c1d81bdbef2d`](https://github.com/evmts/tevm-monorepo/commit/de81ac31460bb642dad401571ad3c1d81bdbef2d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added functionality for passing custom headers

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient
  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports

## 1.0.0-next.22

### Patch Changes

- [#822](https://github.com/evmts/tevm-monorepo/pull/822) [`39a5b5e5`](https://github.com/evmts/tevm-monorepo/commit/39a5b5e52c704d1661b235b271e68129e7dc2a80) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with swallowing errors that didn't return text

- [#804](https://github.com/evmts/tevm-monorepo/pull/804) [`d514d111`](https://github.com/evmts/tevm-monorepo/commit/d514d111ff6b479fbbac07083477d59d70de1290) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with checking method falsely

## 1.0.0-next.21

### Minor Changes

- [#793](https://github.com/evmts/tevm-monorepo/pull/793) [`cc24672a`](https://github.com/evmts/tevm-monorepo/commit/cc24672a0becdf8c555a83ed8e71ebb61e4fd02f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support to jsonrpc http server to handle batch jsonrpc requests

### Patch Changes

- [#796](https://github.com/evmts/tevm-monorepo/pull/796) [`80282898`](https://github.com/evmts/tevm-monorepo/commit/802828983746ca17361f48d71b673b152b458afa) Thanks [@roninjin10](https://github.com/roninjin10)! - Added @tevm/jsonrpc package. This simple package provides common utilities for interacting with JSONRPC api including fetchJson method
