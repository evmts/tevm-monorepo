# @tevm/tsconfig

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages

## 1.0.0-next.117

### Patch Changes

- b53712d: Fixed typo in package.json that eliminated tevm ability to treeshake

## 1.1.0-next.96

### Patch Changes

- [#1301](https://github.com/evmts/tevm-monorepo/pull/1301) [`59268b2`](https://github.com/evmts/tevm-monorepo/commit/59268b2e00423ba8f9ddf6fa89ea0070ae1023a6) Thanks [@roninjin10](https://github.com/roninjin10)! - Added sideEffect: false to package.json for better tree shaking support

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

## 2.0.0-next.79

### Patch Changes

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

## 1.1.0-next.74

### Patch Changes

- [#1186](https://github.com/evmts/tevm-monorepo/pull/1186) [`7765446`](https://github.com/evmts/tevm-monorepo/commit/7765446beec1391a00f3d3dd8d015d5205e0371a) Thanks [@roninjin10](https://github.com/roninjin10)! - Moved files around to colocate code better. Some packages are disappearing

  - Tevm/Zod is now part of Tevm/actions
  - Tevm/actions-types moved to Tevm/actions
  - Tevm/procedures-types moved to Tevm/procedures

## 1.1.0-next.72

### Minor Changes

- [`4094ead`](https://github.com/evmts/tevm-monorepo/commit/4094eadc105790d4e4046187772a8cdbf28c0ef9) - Fix changesets

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

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

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

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

## 1.0.0-next.0

### Patch Changes

- [#573](https://github.com/evmts/tevm-monorepo/pull/573) [`a8248fb5`](https://github.com/evmts/tevm-monorepo/commit/a8248fb5008594a2c5d0797780d7d033a455c442) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated shared tsconfig to default to NodeNext

## 0.8.1

### Patch Changes

- [#453](https://github.com/evmts/tevm-monorepo/pull/453) [`c23302a`](https://github.com/evmts/tevm-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712) Thanks [@roninjin10](https://github.com/roninjin10)! - Started publishing every commit to main so all Tevm changes can be used early. To use the latest main branch release install with `@main` tag. e.g. `npm install @tevm/ts-plugin@main`

## 0.7.1

### Patch Changes

- [#427](https://github.com/evmts/tevm-monorepo/pull/427) [`eb6ec5d`](https://github.com/evmts/tevm-monorepo/commit/eb6ec5dff13c51baa09f0019fb8b1b94a41108cb) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with @tevm/tsconfig not being published to npm
