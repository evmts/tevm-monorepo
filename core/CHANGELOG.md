# @evmts/core

## 0.8.0

### Minor Changes

- [#438](https://github.com/evmts/evmts-monorepo/pull/438) [`eedb7e0`](https://github.com/evmts/evmts-monorepo/commit/eedb7e0e8f853acf59c3f86c1d7317bad8ee7e2b) Thanks [@roninjin10](https://github.com/roninjin10)! - Improve peformance by 98% (5x) testing against 101 simple NFT contract imports

  Major change: remove bytecode from EVMts. Needing the bytecode is a niche use case and removing it improves peformance of the compiler significantly. In future bytecode will be brought back as an optional prop

  This improves peformance by 98% (50x) testing against 101 simple NFT contract imports

  Because EVMts is still considered in alpha this will not cause a major semver bump

### Patch Changes

- [#442](https://github.com/evmts/evmts-monorepo/pull/442) [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in EVMts is consistently updated to it's latest version using `pnpm up --latest`

## 0.6.0

### Patch Changes

- [#367](https://github.com/evmts/evmts-monorepo/pull/367) [`6da3fe7`](https://github.com/evmts/evmts-monorepo/commit/6da3fe7fdec9bc2e4d35fc0558b79c65a105a516) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with read not filtering out events from it's returned object

- [#379](https://github.com/evmts/evmts-monorepo/pull/379) [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated build pipeline to generate .d.ts files

- [#384](https://github.com/evmts/evmts-monorepo/pull/384) [`6dd223b`](https://github.com/evmts/evmts-monorepo/commit/6dd223b0b625bd7dcbea7537f053b32457761955) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgrade deps to latest versions

- [#367](https://github.com/evmts/evmts-monorepo/pull/367) [`6da3fe7`](https://github.com/evmts/evmts-monorepo/commit/6da3fe7fdec9bc2e4d35fc0558b79c65a105a516) Thanks [@roninjin10](https://github.com/roninjin10)! - Added 100% test coverage to @evmts/core

## 0.5.6

### Patch Changes

- [#346](https://github.com/evmts/evmts-monorepo/pull/346) [`6d9365d`](https://github.com/evmts/evmts-monorepo/commit/6d9365db3ab197ea4ad53f777d755ee3ad562b21) Thanks [@roninjin10](https://github.com/roninjin10)! - Change naming to Evmts from EVMts

## 0.5.4

### Patch Changes

- [#337](https://github.com/evmts/evmts-monorepo/pull/337) [`2b8b5ed`](https://github.com/evmts/evmts-monorepo/commit/2b8b5ed9852c32e15a7466f00f4ca9c0458cfeef) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue resolving abitype

## 0.5.3

### Patch Changes

- [#335](https://github.com/evmts/evmts-monorepo/pull/335) [`2dc1950`](https://github.com/evmts/evmts-monorepo/commit/2dc19507c9d957948dcff8f65a359fc25b0ceb10) Thanks [@roninjin10](https://github.com/roninjin10)! - Downgrade abitype to 8.x

## 0.5.2

### Patch Changes

- [#333](https://github.com/evmts/evmts-monorepo/pull/333) [`cdbe2b1`](https://github.com/evmts/evmts-monorepo/commit/cdbe2b14d3a9b40ea37898829bc982b5e76e3c4c) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with including wagmi and viem as peer dependencies

## 0.5.1

### Patch Changes

- [#328](https://github.com/evmts/evmts-monorepo/pull/328) [`cec44b5`](https://github.com/evmts/evmts-monorepo/commit/cec44b5042bc76c21a9b695383714642c2b44da6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with abitype subdep

## 0.5.0

### Patch Changes

- [#308](https://github.com/evmts/evmts-monorepo/pull/308) [`0bd5b45`](https://github.com/evmts/evmts-monorepo/commit/0bd5b4511e292380a7ac87a898d22dbd32df9e35) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with `args` key being undefined rather than not existing in Object.keys

- [#307](https://github.com/evmts/evmts-monorepo/pull/307) [`2ab7c02`](https://github.com/evmts/evmts-monorepo/commit/2ab7c022520fe3c03f337d51dc0f7875830492f1) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all subdependencies

## 0.3.1

### Patch Changes

- [#269](https://github.com/evmts/evmts-monorepo/pull/269) [`1f6919c`](https://github.com/evmts/evmts-monorepo/commit/1f6919cfc54648499129d3642ddbb64568b1e798) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed types. Changed bytecode to `0x${string}` and made chainId type accept a number

## 0.3.0

### Minor Changes

- [#259](https://github.com/evmts/evmts-monorepo/pull/259) [`7ad7463`](https://github.com/evmts/evmts-monorepo/commit/7ad746347d3e127f001abdc28fff2a10c1ffed65) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bytecode to Evmts contracts

### Patch Changes

- [#258](https://github.com/evmts/evmts-monorepo/pull/258) [`9a9b963`](https://github.com/evmts/evmts-monorepo/commit/9a9b96327cd2f8415cf09a471a7589fa3df90394) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with handling overloaded functions

## 0.2.0

### Minor Changes

- [#252](https://github.com/evmts/evmts-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed Evmts configuration to be purely from tsconfig

### Patch Changes

- [#251](https://github.com/evmts/evmts-monorepo/pull/251) [`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing src folder in npm packages

## 0.1.2

### Patch Changes

- [#221](https://github.com/evmts/evmts-monorepo/pull/221) [`ab40941`](https://github.com/evmts/evmts-monorepo/commit/ab40941221c4edacce16659ef88bdfdb90c325bb) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with wagmi not liking empty arrays for functions that take no args

- [#219](https://github.com/evmts/evmts-monorepo/pull/219) [`058d904`](https://github.com/evmts/evmts-monorepo/commit/058d90474598ea790d4de9fd8501381a77edbcb6) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing types in EvmtsContract

## 0.1.1

### Patch Changes

- Fixed bug with missing args type for writes

## 0.1.0

### Minor Changes

- [#213](https://github.com/evmts/evmts-monorepo/pull/213) [`e21f2f4`](https://github.com/evmts/evmts-monorepo/commit/e21f2f4fbdafc7d6d859f513afa319b9812826f0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added humanReadableAbi property to Evmts contracts

- [#212](https://github.com/evmts/evmts-monorepo/pull/212) [`88ec554`](https://github.com/evmts/evmts-monorepo/commit/88ec554a592d29aaba0a0d69ec61fd75118e817c) Thanks [@roninjin10](https://github.com/roninjin10)! - Added event support to Evmts contracts

- [#211](https://github.com/evmts/evmts-monorepo/pull/211) [`877c137`](https://github.com/evmts/evmts-monorepo/commit/877c137dfbe8a143099ddb0656236c35bceb2f87) Thanks [@roninjin10](https://github.com/roninjin10)! - Added lazy evmts usage to use evmts without args

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.4-next.0

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.2

### Patch Changes

- Release working proof of concept
