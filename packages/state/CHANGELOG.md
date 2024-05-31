# @tevm/state

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
