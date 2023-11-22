# @evmts/core

## 1.0.0-next.17

### Patch Changes

- [#716](https://github.com/evmts/evmts-monorepo/pull/716) [`65462ea7`](https://github.com/evmts/evmts-monorepo/commit/65462ea79eff3abf9c7d95324d1c8c696fa0e785) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with not using remappings in ts files

## 1.0.0-next.16

### Minor Changes

- [#714](https://github.com/evmts/evmts-monorepo/pull/714) [`95b534c3`](https://github.com/evmts/evmts-monorepo/commit/95b534c39c3ee637c1b4d8fdc6f9b6fd3193ce80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability to resolve most paths in tsconfig that look similar to '@/_': ['./_']

## 1.0.0-next.15

### Patch Changes

- [#712](https://github.com/evmts/evmts-monorepo/pull/712) [`300440d8`](https://github.com/evmts/evmts-monorepo/commit/300440d84268783e7578242f67867d677dafdd34) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability to resolve tsconfig paths for contract imports

## 1.0.0-next.9

### Patch Changes

- [#686](https://github.com/evmts/evmts-monorepo/pull/686) [`28c82d39`](https://github.com/evmts/evmts-monorepo/commit/28c82d3975a0e1f736353a52144cb3246f1a88ae) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed effect/schema version

- Updated dependencies [[`28c82d39`](https://github.com/evmts/evmts-monorepo/commit/28c82d3975a0e1f736353a52144cb3246f1a88ae)]:
  - @evmts/effect@1.0.0-next.9

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/evmts-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/evmts-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

- Updated dependencies [[`e5a6b24c`](https://github.com/evmts/evmts-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830)]:
  - @evmts/effect@1.0.0-next.8

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/evmts-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

- Updated dependencies [[`77baab6b`](https://github.com/evmts/evmts-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2)]:
  - @evmts/effect@1.0.0-next.5

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/evmts-monorepo/pull/676) [`93cab845`](https://github.com/evmts/evmts-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

- Updated dependencies [[`93cab845`](https://github.com/evmts/evmts-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90)]:
  - @evmts/effect@1.0.0-next.4

## 1.0.0-next.3

### Minor Changes

- [#674](https://github.com/evmts/evmts-monorepo/pull/674) [`eddcef02`](https://github.com/evmts/evmts-monorepo/commit/eddcef024aebc62b713a1fd51304e12f0b093d18) Thanks [@roninjin10](https://github.com/roninjin10)! - Added debug option to evmts config. When turned on the output of evmts contract imports will be written to disk and can be debugged. In future logging for the bundler will also be printed to a debug log file

## 1.0.0-next.0

### Major Changes

- [#485](https://github.com/evmts/evmts-monorepo/pull/485) [`570c4ed6`](https://github.com/evmts/evmts-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933) Thanks [@roninjin10](https://github.com/roninjin10)! - Removed global Address config and external contracts from EVMts to simplify the API

- [#594](https://github.com/evmts/evmts-monorepo/pull/594) [`7065f458`](https://github.com/evmts/evmts-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated evmts/config to be effect.ts based. Effect.ts allows for more robust error handling of config loading. Config package is used mostly internally by EVMts which will all be using Effect internally so the config package no longer resolves configs as values but as Effects completely

- [#594](https://github.com/evmts/evmts-monorepo/pull/594) [`7065f458`](https://github.com/evmts/evmts-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033) Thanks [@roninjin10](https://github.com/roninjin10)! - Removed async methods from evmts/config for effect based replacements. In future if we need the extra peformance we will add support for runPromise

### Patch Changes

- [#589](https://github.com/evmts/evmts-monorepo/pull/589) [`32c7f253`](https://github.com/evmts/evmts-monorepo/commit/32c7f2537555380dd8c48883729add6ea658d52e) Thanks [@roninjin10](https://github.com/roninjin10)! - Converted @evmts/config to js with jsdoc and explicit exports

- [#595](https://github.com/evmts/evmts-monorepo/pull/595) [`64a404ce`](https://github.com/evmts/evmts-monorepo/commit/64a404ce56305c126847be15cf42ab14bfb38764) Thanks [@roninjin10](https://github.com/roninjin10)! - Detailed contributing docs for @evmts/config added to /config/CONTRIBUTING.md

- [#548](https://github.com/evmts/evmts-monorepo/pull/548) [`c12528a3`](https://github.com/evmts/evmts-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all packages to automatically generate up to date reference docs

- [#611](https://github.com/evmts/evmts-monorepo/pull/611) [`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- [#563](https://github.com/evmts/evmts-monorepo/pull/563) [`21ea35e3`](https://github.com/evmts/evmts-monorepo/commit/21ea35e3989ecf5d5eb2946eab96234d170fa9e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Migrated @evmts/config to NodeNext. This will improve overall compatibility with tooling

- [#492](https://github.com/evmts/evmts-monorepo/pull/492) [`2349d58c`](https://github.com/evmts/evmts-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all NPM dependencies to latest

- Updated dependencies [[`747728d9`](https://github.com/evmts/evmts-monorepo/commit/747728d9e909906812472404a5f4155730127bd0)]:
  - @evmts/effect@1.0.0-next.0

## 0.10.0

### Patch Changes

- [#469](https://github.com/evmts/evmts-monorepo/pull/469) [`dbc2da6`](https://github.com/evmts/evmts-monorepo/commit/dbc2da6092eae3a7ec2d2519ea8c04505aa911f6) Thanks [@roninjin10](https://github.com/roninjin10)! - Made @evmts/config loading async

- [#475](https://github.com/evmts/evmts-monorepo/pull/475) [`cb83c0c`](https://github.com/evmts/evmts-monorepo/commit/cb83c0c81fae63decd7bbdb79b9c3cce2c7e0b8e) Thanks [@roninjin10](https://github.com/roninjin10)! - Added snapshot test of vite bundler build outputs

## 0.9.0

### Patch Changes

- [#460](https://github.com/evmts/evmts-monorepo/pull/460) [`1f80589`](https://github.com/evmts/evmts-monorepo/commit/1f8058969e2b0290f5032166928f76cfc74e9d74) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with solc not being correctly listed as a peer dependency

## 0.8.1

### Patch Changes

- [#453](https://github.com/evmts/evmts-monorepo/pull/453) [`c23302a`](https://github.com/evmts/evmts-monorepo/commit/c23302a9623a968917df19de8dfa2c56b4612712) Thanks [@roninjin10](https://github.com/roninjin10)! - Started publishing every commit to main so all EVMts changes can be used early. To use the latest main branch release install with `@main` tag. e.g. `npm install @evmts/ts-plugin@main`

- [#459](https://github.com/evmts/evmts-monorepo/pull/459) [`ae772ac`](https://github.com/evmts/evmts-monorepo/commit/ae772ac62ad16d19c48b82dfd005458bf27200fe) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with evmts failing to load JSONc (JSON with comments). Previously if a tsconfig had comments in it or trailign commas json parsing would failing. Now EVMts will load these jsons correctly via using node-jsonc-parser instead of JSON.parse

## 0.8.0

### Patch Changes

- [#442](https://github.com/evmts/evmts-monorepo/pull/442) [`b020298`](https://github.com/evmts/evmts-monorepo/commit/b020298f1acbfad396b0c1c9a1618e00bc750a43) Thanks [@roninjin10](https://github.com/roninjin10)! - ⬆️ Upgraded all npm packages to latest
  Every package in EVMts is consistently updated to it's latest version using `pnpm up --latest`

## 0.7.0

### Minor Changes

- [#400](https://github.com/evmts/evmts-monorepo/pull/400) [`8f11961`](https://github.com/evmts/evmts-monorepo/commit/8f11961f6b3ebc5882a1e5403d3726df7ddee0d4) Thanks [@roninjin10](https://github.com/roninjin10)! - Added strict validation of the EVMts config with helpful error messages.

  - If an unknown config option is passed now EVMts will fail early
  - Improvements such as better more clear error messages with actionable messages

  Validation is done via zod.strictObject

- [#425](https://github.com/evmts/evmts-monorepo/pull/425) [`fa7555a`](https://github.com/evmts/evmts-monorepo/commit/fa7555a8b0bac268f5297544422c516dae4c5511) Thanks [@roninjin10](https://github.com/roninjin10)! - Added jsconfig.json support to EVMts. EVMts will now autodetect the tsconfig for both tsconfig.json and jsconfig.json. This enables support for JS with JSDoc comments as is popular in svelte and will be used in the upcoming Svelte example application.

### Patch Changes

- [#407](https://github.com/evmts/evmts-monorepo/pull/407) [`c71cd30`](https://github.com/evmts/evmts-monorepo/commit/c71cd30818b311c95852a720c170ef18915b750f) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with swallowing error when tsconfig is missing

  - Previously the underlying error when EVMts was unable to find the tsconfig was never logged.
  - Now if EVMts cannot find the tsconfig the underlying error will be logged before logging the normal EVMts error and exiting

## 0.6.0

### Minor Changes

- [#359](https://github.com/evmts/evmts-monorepo/pull/359) [`e24901a`](https://github.com/evmts/evmts-monorepo/commit/e24901a7b503354af6174bac81a868a8598f143b) Thanks [@roninjin10](https://github.com/roninjin10)! - Added autodetection of solc version. solcVersion is no longer required

- [#377](https://github.com/evmts/evmts-monorepo/pull/377) [`3a2dfae`](https://github.com/evmts/evmts-monorepo/commit/3a2dfae3a38ca7052b57b57e5c95a952a7f0be71) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability to use env variables in EvmtsConfig

### Patch Changes

- [#373](https://github.com/evmts/evmts-monorepo/pull/373) [`6de12df`](https://github.com/evmts/evmts-monorepo/commit/6de12df39cf9da0635c246c685036e83a8e97255) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with etherscan section of the EvmtsConfig requiring all networks

- [#379](https://github.com/evmts/evmts-monorepo/pull/379) [`0ff53e7`](https://github.com/evmts/evmts-monorepo/commit/0ff53e71ff792ed4df1fa180f5a72dd5d65f4142) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated build pipeline to generate .d.ts files

## 0.5.6

### Patch Changes

- [#346](https://github.com/evmts/evmts-monorepo/pull/346) [`6d9365d`](https://github.com/evmts/evmts-monorepo/commit/6d9365db3ab197ea4ad53f777d755ee3ad562b21) Thanks [@roninjin10](https://github.com/roninjin10)! - Change naming to Evmts from EVMts

## 0.5.4

### Patch Changes

- [#338](https://github.com/evmts/evmts-monorepo/pull/338) [`0116537`](https://github.com/evmts/evmts-monorepo/commit/0116537d3423c8decfd0adaf490d37d33f8a540f) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all dependnecies

## 0.5.0

### Minor Changes

- [#283](https://github.com/evmts/evmts-monorepo/pull/283) [`05a8efe`](https://github.com/evmts/evmts-monorepo/commit/05a8efede4acad157e3820bdba24d92f598699e5) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated config schema to support etherscan

  - Solc version is now listed under `compiler.solcVersion` instead of `solc`
  - Foundry projects are now listed under `compiler.foundryProject` instead of `forge`
  - Local contracts are now specified under `localContracts.contracts` instead of `deployments`
  - New external option (unimplemented) `externalContracts` which is used to specifify contracts imported from etherscan in the next release

- [#297](https://github.com/evmts/evmts-monorepo/pull/297) [`85c340d`](https://github.com/evmts/evmts-monorepo/commit/85c340dc4a63afdbc6bd92fb4b2cf3fe0ffdc6e7) Thanks [@roninjin10](https://github.com/roninjin10)! - Added suport for non relative imports including absolute imports with baseUrl in tsconfig, imports of contracts in node_modules, and imports of contracts in foundry lib

### Patch Changes

- [#286](https://github.com/evmts/evmts-monorepo/pull/286) [`700b3d0`](https://github.com/evmts/evmts-monorepo/commit/700b3d0907df243b29e96b1b3246b8c75cfb9900) Thanks [@roninjin10](https://github.com/roninjin10)! - Made etherscan api keys a chainID mapping. This is because different chains have different etherscan keys

- [#322](https://github.com/evmts/evmts-monorepo/pull/322) [`720bfdb`](https://github.com/evmts/evmts-monorepo/commit/720bfdba790699e388c5ec1c68630b9f0f077158) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed config not throwing when unknown properties are passed

- [#322](https://github.com/evmts/evmts-monorepo/pull/322) [`720bfdb`](https://github.com/evmts/evmts-monorepo/commit/720bfdba790699e388c5ec1c68630b9f0f077158) Thanks [@roninjin10](https://github.com/roninjin10)! - Added backwards compatibility for config change with deprecation warnings

## 0.2.1

### Patch Changes

- [#276](https://github.com/evmts/evmts-monorepo/pull/276) [`2a89e13`](https://github.com/evmts/evmts-monorepo/commit/2a89e136d8dfcd997ae5ff227a96de4702dfbe19) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with parsing foundry.toml

## 0.2.0

### Minor Changes

- [#268](https://github.com/evmts/evmts-monorepo/pull/268) [`a37844f`](https://github.com/evmts/evmts-monorepo/commit/a37844faa425d1eaca112b9a09640b7ec7e288de) Thanks [@roninjin10](https://github.com/roninjin10)! - Added support for detecting foundry.toml and remappings as tsconfig option. Set forge: true in plugin tsconfig options or forge: '/path/to/binary/forge' for a custom forge binary

## 0.1.0

### Minor Changes

- [#252](https://github.com/evmts/evmts-monorepo/pull/252) [`4b361ea`](https://github.com/evmts/evmts-monorepo/commit/4b361ea43fb34541bee4f75c8bea9d93543b1813) Thanks [@roninjin10](https://github.com/roninjin10)! - Changed Evmts configuration to be purely from tsconfig

### Patch Changes

- [#251](https://github.com/evmts/evmts-monorepo/pull/251) [`52732a1`](https://github.com/evmts/evmts-monorepo/commit/52732a1bcd59faa7970e5298d1e71a61c687fd67) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed missing src folder in npm packages

## 0.0.1

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.1-next.0

### Patch Changes

- [`2a31d64`](https://github.com/evmts/evmts-monorepo/commit/2a31d640b61a3e3eda63e0ca0442104ea27bfaec) - Init new changesets

## 0.0.2

### Patch Changes

- Release working proof of concept
