# @evmts/core

## 0.5.3

### Patch Changes

- Updated dependencies [[`2dc1950`](https://github.com/evmts/evmts-monorepo/commit/2dc19507c9d957948dcff8f65a359fc25b0ceb10)]:
  - @evmts/core@0.5.3

## 0.5.2

### Patch Changes

- Updated dependencies [[`cdbe2b1`](https://github.com/evmts/evmts-monorepo/commit/cdbe2b14d3a9b40ea37898829bc982b5e76e3c4c)]:
  - @evmts/core@0.5.2

## 0.5.1

### Patch Changes

- Updated dependencies [[`cec44b5`](https://github.com/evmts/evmts-monorepo/commit/cec44b5042bc76c21a9b695383714642c2b44da6)]:
  - @evmts/core@0.5.1

## 0.5.0

### Minor Changes

- [#283](https://github.com/evmts/evmts-monorepo/pull/283) [`05a8efe`](https://github.com/evmts/evmts-monorepo/commit/05a8efede4acad157e3820bdba24d92f598699e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated config schema to support etherscan
  - Solc version is now listed under `compiler.solcVersion` instead of `solc`
  - Foundry projects are now listed under `compiler.foundryProject` instead of `forge`
  - Local contracts are now specified under `localContracts.contracts` instead of `deployments`
  - New external option (unimplemented) `externalContracts` which is used to specifify contracts imported from etherscan in the next release

### Patch Changes

- [#298](https://github.com/evmts/evmts-monorepo/pull/298) [`841d6a8`](https://github.com/evmts/evmts-monorepo/commit/841d6a89f4995e4f666902d27cb7dbfc3efd77e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with etherscan links showing as undefined if they didn't exist

- [#301](https://github.com/evmts/evmts-monorepo/pull/301) [`83bf23b`](https://github.com/evmts/evmts-monorepo/commit/83bf23b0cb2eb5860f9dfb63a773541e48c62abc) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependencies

- Updated dependencies [[`700b3d0`](https://github.com/evmts/evmts-monorepo/commit/700b3d0907df243b29e96b1b3246b8c75cfb9900), [`720bfdb`](https://github.com/evmts/evmts-monorepo/commit/720bfdba790699e388c5ec1c68630b9f0f077158), [`05a8efe`](https://github.com/evmts/evmts-monorepo/commit/05a8efede4acad157e3820bdba24d92f598699e5), [`85c340d`](https://github.com/evmts/evmts-monorepo/commit/85c340dc4a63afdbc6bd92fb4b2cf3fe0ffdc6e7), [`0bd5b45`](https://github.com/evmts/evmts-monorepo/commit/0bd5b4511e292380a7ac87a898d22dbd32df9e35), [`720bfdb`](https://github.com/evmts/evmts-monorepo/commit/720bfdba790699e388c5ec1c68630b9f0f077158), [`2ab7c02`](https://github.com/evmts/evmts-monorepo/commit/2ab7c022520fe3c03f337d51dc0f7875830492f1)]:
  - @evmts/config@0.5.0
  - @evmts/core@0.5.0

## 0.4.2

### Patch Changes

- [#279](https://github.com/evmts/evmts-monorepo/pull/279) [`fd6b482`](https://github.com/evmts/evmts-monorepo/commit/fd6b4825417fa81d601e9a3c5078131bc1f816c0) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed source file does not exist warning in @evmts/bundler

## 0.4.1

### Patch Changes

- Updated dependencies [[`2a89e13`](https://github.com/evmts/evmts-monorepo/commit/2a89e136d8dfcd997ae5ff227a96de4702dfbe19)]:
  - @evmts/config@0.2.1

## 0.4.0

### Minor Changes

- [#268](https://github.com/evmts/evmts-monorepo/pull/268) [`a37844f`](https://github.com/evmts/evmts-monorepo/commit/a37844faa425d1eaca112b9a09640b7ec7e288de) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for detecting foundry.toml and remappings as tsconfig option. Set forge: true in plugin tsconfig options or forge: '/path/to/binary/forge' for a custom forge binary

### Patch Changes

- Updated dependencies [[`1f6919c`](https://github.com/evmts/evmts-monorepo/commit/1f6919cfc54648499129d3642ddbb64568b1e798), [`a37844f`](https://github.com/evmts/evmts-monorepo/commit/a37844faa425d1eaca112b9a09640b7ec7e288de)]:
  - @evmts/core@0.3.1
  - @evmts/config@0.2.0

## 0.3.0

### Minor Changes

- [#259](https://github.com/evmts/evmts-monorepo/pull/259) [`7ad7463`](https://github.com/evmts/evmts-monorepo/commit/7ad746347d3e127f001abdc28fff2a10c1ffed65) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bytecode to EVMts contracts

### Patch Changes

- [#258](https://github.com/evmts/evmts-monorepo/pull/258) [`9a9b963`](https://github.com/evmts/evmts-monorepo/commit/9a9b96327cd2f8415cf09a471a7589fa3df90394) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with handling overloaded functions

- Updated dependencies [[`7ad7463`](https://github.com/evmts/evmts-monorepo/commit/7ad746347d3e127f001abdc28fff2a10c1ffed65), [`9a9b963`](https://github.com/evmts/evmts-monorepo/commit/9a9b96327cd2f8415cf09a471a7589fa3df90394)]:
  - @evmts/core@0.3.0

## 0.2.0

### Minor Changes

- [#252](https://github.com/evmts/evmts-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed EVMts configuration to be purely from tsconfig

### Patch Changes

- [#251](https://github.com/evmts/evmts-monorepo/pull/251) [`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing src folder in npm packages

- Updated dependencies [[`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67), [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813)]:
  - @evmts/config@0.1.0
  - @evmts/core@0.2.0

## 0.1.0

### Minor Changes

- [#249](https://github.com/evmts/evmts-monorepo/pull/249) [`fda2523`](https://github.com/evmts/evmts-monorepo/commit/fda25237cea8a4e94fc6dc043174810ae441fb8e) Thanks [@roninjin10](https://github.com/roninjin10)! - Added etherscan links for most major EVM networks

### Patch Changes

- [#247](https://github.com/evmts/evmts-monorepo/pull/247) [`f7ba6e5`](https://github.com/evmts/evmts-monorepo/commit/f7ba6e5546263d7a94baf50ca1010a2b505580e0) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed incorrect peer dependency configuation for solc

## 0.0.3

### Patch Changes

- Updated dependencies [[`ab40941`](https://github.com/evmts/evmts-monorepo/commit/ab40941221c4edacce16659ef88bdfdb90c325bb), [`058d904`](https://github.com/evmts/evmts-monorepo/commit/058d90474598ea790d4de9fd8501381a77edbcb6)]:
  - @evmts/core@0.1.2

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @evmts/core@0.1.1

## 0.0.1

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

- Updated dependencies [[`e21f2f4`](https://github.com/evmts/evmts-monorepo/commit/e21f2f4fbdafc7d6d859f513afa319b9812826f0), [`88ec554`](https://github.com/evmts/evmts-monorepo/commit/88ec554a592d29aaba0a0d69ec61fd75118e817c), [`877c137`](https://github.com/evmts/evmts-monorepo/commit/877c137dfbe8a143099ddb0656236c35bceb2f87), [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec)]:
  - @evmts/core@0.1.0
  - @evmts/config@0.0.1

## 0.0.1-next.0

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

- Updated dependencies [[`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec)]:
  - @evmts/config@0.0.1-next.0
  - @evmts/core@0.0.4-next.0

## 0.0.2

### Patch Changes

- Release working proof of concept
