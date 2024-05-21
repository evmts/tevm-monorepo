# @tevm/state

## 1.1.0-next.56

### Patch Changes

- Updated dependencies []:
  - @tevm/predeploys@1.1.0-next.56
  - @tevm/blockchain@1.1.0-next.56

## 1.1.0-next.55

### Patch Changes

- Updated dependencies [[`82d7145`](https://github.com/evmts/tevm-monorepo/commit/82d714501f3a895e5de8da1559f229690a6725e8)]:
  - @tevm/blockchain@1.1.0-next.55

## 1.1.0-next.52

### Patch Changes

- [#1088](https://github.com/evmts/tevm-monorepo/pull/1088) [`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with failing to include changeset for tx package. Bumping every package just to be safe

- Updated dependencies [[`65e4089`](https://github.com/evmts/tevm-monorepo/commit/65e40891fca12fc7fde5d1e177527cd70b28cb1f)]:
  - @tevm/blockchain@1.1.0-next.52
  - @tevm/common@1.1.0-next.52
  - @tevm/logger@1.1.0-next.52
  - @tevm/predeploys@1.1.0-next.52
  - @tevm/utils@1.1.0-next.52

## 1.1.0-next.50

### Patch Changes

- Updated dependencies [[`1a9c577`](https://github.com/evmts/tevm-monorepo/commit/1a9c57797871fc51fe8240bec745b981da030ac4), [`71e5c1e`](https://github.com/evmts/tevm-monorepo/commit/71e5c1ead386f43a3bfbdd53acffcb5b49ad3433)]:
  - @tevm/blockchain@1.1.0-next.50

## 1.1.0-next.47

### Patch Changes

- [#1064](https://github.com/evmts/tevm-monorepo/pull/1064) [`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed test-utils package being mistakedly private

- Updated dependencies [[`85d9143`](https://github.com/evmts/tevm-monorepo/commit/85d9143262396416a5d94b527f7bd3148ab51069)]:
  - @tevm/blockchain@1.1.0-next.47
  - @tevm/common@1.1.0-next.47
  - @tevm/logger@1.1.0-next.47
  - @tevm/predeploys@1.1.0-next.47
  - @tevm/utils@1.1.0-next.47

## 1.1.0-next.46

### Patch Changes

- Updated dependencies [[`4da1830`](https://github.com/evmts/tevm-monorepo/commit/4da1830d2c0df764156b79f12508d11702694b3d), [`413533d`](https://github.com/evmts/tevm-monorepo/commit/413533de36b359711253ba6918afcb1363ec14bc)]:
  - @tevm/common@1.1.0-next.46
  - @tevm/blockchain@1.1.0-next.46

## 1.1.0-next.45

### Patch Changes

- [#1002](https://github.com/evmts/tevm-monorepo/pull/1002) [`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all of tevm to latest version of Ethereumjs. This update adds support for 4844, fixes major bugs in tevm regarding browser compatibility, and an issue that was causing tevm to crash in Next.js app router.

- [#985](https://github.com/evmts/tevm-monorepo/pull/985) [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all deps to latest version

- Updated dependencies [[`95ecf92`](https://github.com/evmts/tevm-monorepo/commit/95ecf927b4c93aff6007887c0d72579ebe50d423), [`07a10a3`](https://github.com/evmts/tevm-monorepo/commit/07a10a3eeef7a417d43a492668da1bf35db0e921)]:
  - @tevm/blockchain@1.1.0-next.45
  - @tevm/predeploys@1.1.0-next.45
  - @tevm/common@1.1.0-next.45
  - @tevm/utils@1.1.0-next.45

## 1.0.0-next.42

### Patch Changes

- Updated dependencies [[`0f4bcdb340b86deb5523ba3b63f03df8d2a134f6`](https://github.com/evmts/tevm-monorepo/commit/0f4bcdb340b86deb5523ba3b63f03df8d2a134f6)]:
  - @tevm/blockchain@1.0.0-next.42

## 1.0.0-next.40

### Patch Changes

- [#962](https://github.com/evmts/tevm-monorepo/pull/962) [`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a) Thanks [@roninjin10](https://github.com/roninjin10)! - Added docs for all packages to https://tevm.sh

- Updated dependencies [[`64c3c6dd09c236c516b117a506380028c3154c4a`](https://github.com/evmts/tevm-monorepo/commit/64c3c6dd09c236c516b117a506380028c3154c4a)]:
  - @tevm/blockchain@1.0.0-next.40
  - @tevm/common@1.0.0-next.40
  - @tevm/predeploys@1.0.0-next.40

## 1.0.0-next.39

### Minor Changes

- [#943](https://github.com/evmts/tevm-monorepo/pull/943) [`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f) Thanks [@roninjin10](https://github.com/roninjin10)! - Added new @tevm/utils package @tevm/decorators package and @tevm/base-client package. The @tevm/utils package has utils used throughout all of tevm. @tevm/base-client has a base client that can be decorated with actions like a viem client. The @tevm/decorators has decorators that can be added to @tevm/base

### Patch Changes

- Updated dependencies [[`fd87149043176fb085cd2b162531c1692c46eb8f`](https://github.com/evmts/tevm-monorepo/commit/fd87149043176fb085cd2b162531c1692c46eb8f)]:
  - @tevm/blockchain@1.0.0-next.39
  - @tevm/predeploys@1.0.0-next.39
  - @tevm/common@1.0.0-next.39

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
