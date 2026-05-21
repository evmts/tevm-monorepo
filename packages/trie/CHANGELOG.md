# @tevm/state

## 1.0.0-next.151

### Patch Changes

- 2d9d44b: bumping potentially one last time before release
- 725f0ae: Bug fixes to lots of packages done with ai and no changeset

## 1.0.0-next.148

### Patch Changes

- c337f69: Internal release

## 1.0.0-next.142

### Patch Changes

- 407646e: BUmp every package

## 1.0.0-next.131

### Patch Changes

- e91acbc: Improved docs testcoverage and jsdoc of all packages

## 1.0.0-next.128

### Patch Changes

- bc0c4a1: Rerelease packages

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

## 2.0.0-next.80

### Patch Changes

- [#1221](https://github.com/evmts/tevm-monorepo/pull/1221) [`b0b63d2`](https://github.com/evmts/tevm-monorepo/commit/b0b63d22076f35d76898ab1094ece9668ceef95d) Thanks [@roninjin10](https://github.com/roninjin10)! - Bump bundler

## 2.0.0-next.79

### Patch Changes

- [#1219](https://github.com/evmts/tevm-monorepo/pull/1219) [`a8070b7`](https://github.com/evmts/tevm-monorepo/commit/a8070b769da6695d5e27569809f8ac86866b081d) Thanks [@roninjin10](https://github.com/roninjin10)! - Making sure every package releases

## 1.1.0-next.77

### Patch Changes

- [#1200](https://github.com/evmts/tevm-monorepo/pull/1200) [`398daa0`](https://github.com/evmts/tevm-monorepo/commit/398daa059ed1c4373200da1a114ef07d156b207d) Thanks [@roninjin10](https://github.com/roninjin10)! - Rerelease tevm packages

## 1.1.0-next.75

### Patch Changes

- [#1193](https://github.com/evmts/tevm-monorepo/pull/1193) [`db7bfc7`](https://github.com/evmts/tevm-monorepo/commit/db7bfc7bac341e29e2df20569347eb019e2d37a7) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated server, utils and trie packages. Update readmes. Update jsdoc. Update error handling. Fix corner case bugs found. Add test coverage

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

## 1.1.0-next.45

### Patch Changes

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

## 1.0.0-next.42

### Patch Changes

- [#977](https://github.com/evmts/tevm-monorepo/pull/977) [`0f4bcdb340b86deb5523ba3b63f03df8d2a134f6`](https://github.com/evmts/tevm-monorepo/commit/0f4bcdb340b86deb5523ba3b63f03df8d2a134f6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug where cannonical block header was not being passed into EVM

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

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
