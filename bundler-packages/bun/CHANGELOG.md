# @tevm/bun-plugin

## 1.0.0-next.28

### Patch Changes

- [#913](https://github.com/evmts/tevm-monorepo/pull/913) [`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with packages linking to older versions of tevm

- Updated dependencies [[`06268ffeebaec950d1606732c4eb6fd5f9bb77d5`](https://github.com/evmts/tevm-monorepo/commit/06268ffeebaec950d1606732c4eb6fd5f9bb77d5)]:
  - @tevm/base-bundler@1.0.0-next.28
  - @tevm/bundler-cache@1.0.0-next.28
  - @tevm/config@1.0.0-next.28
  - @tevm/solc@1.0.0-next.28

## 1.0.0-next.25

### Patch Changes

- Updated dependencies []:
  - @tevm/base-bundler@1.0.0-next.25

## 1.0.0-next.24

### Patch Changes

- [#869](https://github.com/evmts/tevm-monorepo/pull/869) [`7059ebbe3f33fc36070b0cc16358dfeec452de0b`](https://github.com/evmts/tevm-monorepo/commit/7059ebbe3f33fc36070b0cc16358dfeec452de0b) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with resolving external modules correctly with bun plugin in pnpm repo

## 1.0.0-next.23

### Major Changes

- [#846](https://github.com/evmts/tevm-monorepo/pull/846) [`1e50901789c983dc6d8f7e078d25ab999afcb085`](https://github.com/evmts/tevm-monorepo/commit/1e50901789c983dc6d8f7e078d25ab999afcb085) Thanks [@roninjin10](https://github.com/roninjin10)! - Consistently name all bundler plugins with rollup convention of bundlerPluginTevm like vitePluginTevm or WebpackPluginTevm

### Patch Changes

- [#862](https://github.com/evmts/tevm-monorepo/pull/862) [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3) Thanks [@roninjin10](https://github.com/roninjin10)! - - Renamed MemoryTevm MemoryClient

  - Renamed TevmClient HttpClient
  - Replaced @tevm/actions-types package with @tevm/actions-types, @tevm/client-types, and @tevm/procedures-types packages
  - Moved errors to @tevm/errors
  - Moved bundler packages out of tevm and to @tevm/bundler package
  - Minimized packages exposed in tevm package
  - Fixed bug with missing types exports

- [#846](https://github.com/evmts/tevm-monorepo/pull/846) [`1e50901789c983dc6d8f7e078d25ab999afcb085`](https://github.com/evmts/tevm-monorepo/commit/1e50901789c983dc6d8f7e078d25ab999afcb085) Thanks [@roninjin10](https://github.com/roninjin10)! - Added full jsdoc documentation to main bundler code

- Updated dependencies [[`1e50901789c983dc6d8f7e078d25ab999afcb085`](https://github.com/evmts/tevm-monorepo/commit/1e50901789c983dc6d8f7e078d25ab999afcb085), [`f217fa4dc2f730cc109940ef36872229ae9f26d3`](https://github.com/evmts/tevm-monorepo/commit/f217fa4dc2f730cc109940ef36872229ae9f26d3), [`1e50901789c983dc6d8f7e078d25ab999afcb085`](https://github.com/evmts/tevm-monorepo/commit/1e50901789c983dc6d8f7e078d25ab999afcb085)]:
  - @tevm/base-bundler@1.0.0-next.23
  - @tevm/bundler-cache@1.0.0-next.23
  - @tevm/config@1.0.0-next.23
  - @tevm/solc@1.0.0-next.23

## 1.0.0-next.21

### Patch Changes

- [#773](https://github.com/evmts/tevm-monorepo/pull/773) [`d4cbefb9`](https://github.com/evmts/tevm-monorepo/commit/d4cbefb9120ad391f436aee54d0739d9535cf512) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed bug with bun plugin resolving .d.ts files and not resolving .mjs and .cjs files.

- [#788](https://github.com/evmts/tevm-monorepo/pull/788) [`a7026e37`](https://github.com/evmts/tevm-monorepo/commit/a7026e372c2ce2aca2ff7f9e058fd4ff95700833) Thanks [@roninjin10](https://github.com/roninjin10)! - Improved peformance of bundler operations by utilzing more async methods rather than syncronous methods for file system access

- Updated dependencies [[`a9be5009`](https://github.com/evmts/tevm-monorepo/commit/a9be5009bb642c35b3a405c0be888b85d398c56e), [`c7a314cc`](https://github.com/evmts/tevm-monorepo/commit/c7a314cc71e28774dc5f03b0c9c8c578a2dda3f7), [`d1affad0`](https://github.com/evmts/tevm-monorepo/commit/d1affad04b0f3acaa801176301ec03b5f3247225), [`e7f75e0b`](https://github.com/evmts/tevm-monorepo/commit/e7f75e0bcf2efa6e30de8fbc686f15ea3944aeb7), [`a7026e37`](https://github.com/evmts/tevm-monorepo/commit/a7026e372c2ce2aca2ff7f9e058fd4ff95700833), [`9c3e6a9a`](https://github.com/evmts/tevm-monorepo/commit/9c3e6a9aec2ec5b0689b2c7463525071bd67163e)]:
  - @tevm/config@1.0.0-next.21
  - @tevm/solc@1.0.0-next.21
  - @tevm/base@1.0.0-next.21
  - @tevm/bundler-cache@1.0.0-next.21

## 1.0.0-next.18

### Patch Changes

- [#725](https://github.com/evmts/tevm-monorepo/pull/725) [`2dbc4d62`](https://github.com/evmts/tevm-monorepo/commit/2dbc4d62f6ee6ee499c1a720f36476367618268f) Thanks [@roninjin10](https://github.com/roninjin10)! - Defaults solc to using version 0.8.23 if not specified. Solc is no longer needed as a peer dependency

- Updated dependencies [[`f8121742`](https://github.com/evmts/tevm-monorepo/commit/f8121742b323483e786e7448c28962d5995a442a), [`2dbc4d62`](https://github.com/evmts/tevm-monorepo/commit/2dbc4d62f6ee6ee499c1a720f36476367618268f)]:
  - @tevm/solc@1.0.0-next.18
  - @tevm/base@1.0.0-next.18

## 1.0.0-next.17

### Patch Changes

- Updated dependencies [[`65462ea7`](https://github.com/evmts/tevm-monorepo/commit/65462ea79eff3abf9c7d95324d1c8c696fa0e785)]:
  - @tevm/config@1.0.0-next.17
  - @tevm/base@1.0.0-next.17

## 1.0.0-next.16

### Minor Changes

- [#714](https://github.com/evmts/tevm-monorepo/pull/714) [`95b534c3`](https://github.com/evmts/tevm-monorepo/commit/95b534c39c3ee637c1b4d8fdc6f9b6fd3193ce80) Thanks [@roninjin10](https://github.com/roninjin10)! - Added ability to resolve most paths in tsconfig that look similar to '@/_': ['./_']

### Patch Changes

- Updated dependencies [[`95b534c3`](https://github.com/evmts/tevm-monorepo/commit/95b534c39c3ee637c1b4d8fdc6f9b6fd3193ce80)]:
  - @tevm/config@1.0.0-next.16
  - @tevm/base@1.0.0-next.16

## 1.0.0-next.15

### Patch Changes

- Updated dependencies [[`300440d8`](https://github.com/evmts/tevm-monorepo/commit/300440d84268783e7578242f67867d677dafdd34)]:
  - @tevm/config@1.0.0-next.15
  - @tevm/base@1.0.0-next.15

## 1.0.0-next.13

### Patch Changes

- Updated dependencies []:
  - @tevm/base@1.0.0-next.13

## 1.0.0-next.12

### Patch Changes

- Updated dependencies []:
  - @tevm/base@1.0.0-next.12

## 1.0.0-next.11

### Patch Changes

- Updated dependencies [[`3af18276`](https://github.com/evmts/tevm-monorepo/commit/3af1827637ef43d351398578e8cfbbd825dbb98d)]:
  - @tevm/base@1.0.0-next.11

## 1.0.0-next.9

### Patch Changes

- Updated dependencies [[`28c82d39`](https://github.com/evmts/tevm-monorepo/commit/28c82d3975a0e1f736353a52144cb3246f1a88ae)]:
  - @tevm/config@1.0.0-next.9
  - @tevm/base@1.0.0-next.9

## 1.0.0-next.8

### Patch Changes

- [#684](https://github.com/evmts/tevm-monorepo/pull/684) [`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed version mismatch issues with effect

- Updated dependencies [[`e5a6b24c`](https://github.com/evmts/tevm-monorepo/commit/e5a6b24cb4717dbffeb7f131ab1e3bd80c1b1830)]:
  - @tevm/config@1.0.0-next.8
  - @tevm/base@1.0.0-next.8

## 1.0.0-next.6

### Patch Changes

- Updated dependencies []:
  - @tevm/base@1.0.0-next.6

## 1.0.0-next.5

### Patch Changes

- [#678](https://github.com/evmts/tevm-monorepo/pull/678) [`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2) Thanks [@roninjin10](https://github.com/roninjin10)! - Fixed issue with npm publishing

- Updated dependencies [[`77baab6b`](https://github.com/evmts/tevm-monorepo/commit/77baab6b56bfdd200d5f5bb00636c6f519925ac2)]:
  - @tevm/base@1.0.0-next.5
  - @tevm/config@1.0.0-next.5

## 1.0.0-next.4

### Patch Changes

- [#676](https://github.com/evmts/tevm-monorepo/pull/676) [`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90) Thanks [@roninjin10](https://github.com/roninjin10)! - Switched package manager to pnpm from bun

- Updated dependencies [[`93cab845`](https://github.com/evmts/tevm-monorepo/commit/93cab8451874bb16e8f21bb86c909c8aab277d90)]:
  - @tevm/config@1.0.0-next.4
  - @tevm/base@1.0.0-next.4

## 1.0.0-next.3

### Patch Changes

- Updated dependencies [[`eddcef02`](https://github.com/evmts/tevm-monorepo/commit/eddcef024aebc62b713a1fd51304e12f0b093d18)]:
  - @tevm/config@1.0.0-next.3
  - @tevm/base@1.0.0-next.3

## 1.0.0-next.2

### Minor Changes

- [#668](https://github.com/evmts/tevm-monorepo/pull/668) [`31ed39a5`](https://github.com/evmts/tevm-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785) Thanks [@roninjin10](https://github.com/roninjin10)! - Added back bytecode to Tevm bundler. When the compiler encounters a file ending in .s.sol it will compile the bytecode in addition to the abi

### Patch Changes

- Updated dependencies [[`31ed39a5`](https://github.com/evmts/tevm-monorepo/commit/31ed39a58665ac555a2f18f5fcf5bc800b135785)]:
  - @tevm/base@1.0.0-next.2

## 1.0.0-next.0

### Patch Changes

- [#548](https://github.com/evmts/tevm-monorepo/pull/548) [`c12528a3`](https://github.com/evmts/tevm-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated all packages to automatically generate up to date reference docs

- [#611](https://github.com/evmts/tevm-monorepo/pull/611) [`747728d9`](https://github.com/evmts/tevm-monorepo/commit/747728d9e909906812472404a5f4155730127bd0) Thanks [@roninjin10](https://github.com/roninjin10)! - Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files

- [#492](https://github.com/evmts/tevm-monorepo/pull/492) [`2349d58c`](https://github.com/evmts/tevm-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d) Thanks [@roninjin10](https://github.com/roninjin10)! - Upgraded all NPM dependencies to latest

- [#499](https://github.com/evmts/tevm-monorepo/pull/499) [`bc4b5a4f`](https://github.com/evmts/tevm-monorepo/commit/bc4b5a4f92ff5e1bbf3dd6acd8b5a69b84ac603d) Thanks [@roninjin10](https://github.com/roninjin10)! - Added in memory caching to all Tevm bundlers and LSP

- [#565](https://github.com/evmts/tevm-monorepo/pull/565) [`738e2fe8`](https://github.com/evmts/tevm-monorepo/commit/738e2fe80a30b27a7d96fb3e42ae1ae604a34804) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated @tevm/bun-plugin to NodeNext this will improve compatibility

- Updated dependencies [[`32c7f253`](https://github.com/evmts/tevm-monorepo/commit/32c7f2537555380dd8c48883729add6ea658d52e), [`570c4ed6`](https://github.com/evmts/tevm-monorepo/commit/570c4ed60d494f36f0839113507f3725e13dc933), [`64a404ce`](https://github.com/evmts/tevm-monorepo/commit/64a404ce56305c126847be15cf42ab14bfb38764), [`c12528a3`](https://github.com/evmts/tevm-monorepo/commit/c12528a3b1c16ecb7a6b4e3487070feebd9a8c3e), [`7065f458`](https://github.com/evmts/tevm-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033), [`747728d9`](https://github.com/evmts/tevm-monorepo/commit/747728d9e909906812472404a5f4155730127bd0), [`21ea35e3`](https://github.com/evmts/tevm-monorepo/commit/21ea35e3989ecf5d5eb2946eab96234d170fa9e5), [`2349d58c`](https://github.com/evmts/tevm-monorepo/commit/2349d58ca90bc78a98db6284b65d6dd329ac140d), [`7065f458`](https://github.com/evmts/tevm-monorepo/commit/7065f4585a2173548abda55cdeaf3fbf1679f033)]:
  - @tevm/config@1.0.0-next.0
  - @tevm/base@1.0.0-next.0

## 0.11.2

### Patch Changes

- Updated dependencies []:
  - @tevm/base@0.11.2

## 0.10.0

### Patch Changes

- [#469](https://github.com/evmts/tevm-monorepo/pull/469) [`dbc2da6`](https://github.com/evmts/tevm-monorepo/commit/dbc2da6092eae3a7ec2d2519ea8c04505aa911f6) Thanks [@roninjin10](https://github.com/roninjin10)! - Made @tevm/config loading async

- [#466](https://github.com/evmts/tevm-monorepo/pull/466) [`1c4cbd2`](https://github.com/evmts/tevm-monorepo/commit/1c4cbd2b87abd1c2174fb0d2e7a684367e074440) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated Bun to use native Bun.file api which is more peformant than using `fs`

- [#468](https://github.com/evmts/tevm-monorepo/pull/468) [`e99fcd0`](https://github.com/evmts/tevm-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30) Thanks [@roninjin10](https://github.com/roninjin10)! - Improved peformance via using native Bun FS methods

- [#468](https://github.com/evmts/tevm-monorepo/pull/468) [`e99fcd0`](https://github.com/evmts/tevm-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30) Thanks [@roninjin10](https://github.com/roninjin10)! - Improved peformance of bundler via enabling async mode

  Previously all bundlers including the Bun bundler ran with syncronous IO such as readFileSync. With the introduction of async mode the bundler now is more non blocking when it is bundling now. Solc is still syncronous but all IO is now async.

  @tevm/base now takes a File-Access-Object as a param. This FileAccessObject is the same shape as `node:fs` module. Bun uses this generic interace to use native Bun file access.

- Updated dependencies [[`dbc2da6`](https://github.com/evmts/tevm-monorepo/commit/dbc2da6092eae3a7ec2d2519ea8c04505aa911f6), [`1c4cbd2`](https://github.com/evmts/tevm-monorepo/commit/1c4cbd2b87abd1c2174fb0d2e7a684367e074440), [`e99fcd0`](https://github.com/evmts/tevm-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30), [`cb83c0c`](https://github.com/evmts/tevm-monorepo/commit/cb83c0c81fae63decd7bbdb79b9c3cce2c7e0b8e)]:
  - @tevm/base@0.10.0
  - @tevm/config@0.10.0

## 0.9.0

### Minor Changes

- [#460](https://github.com/evmts/tevm-monorepo/pull/460) [`1f80589`](https://github.com/evmts/tevm-monorepo/commit/1f8058969e2b0290f5032166928f76cfc74e9d74) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bun support with the new @tevm/bun-plugin package. This enables solidity files to be imported into bun

  ### Installation

  Install build dependencies

  ```typescript
  pnpm install -D bun-types @tevm/bun-plugin @tevm/ts-plugin @tevm/contract solc
  ```

  ### Setup

  first create a `plugins.ts` file

  ```typescript
  import { tevmBunPlugin } from "@tevm/bun-plugin";
  import { plugin } from "bun";

  plugin(tevmBunPlugin());
  ```

  Next load your `plugin.ts` file in your `bunfig.toml`

  ```toml
  preload = ["./plugins.ts"]

  # add to [test] to use plugin in bun test too
  [test]
  preload = ["./plugins.ts"]
  ```

  ### Usage

  Once set up you can import solidity files directly from node modules such as `openzepplin/contracts` or your source code. You can use with viem ethersjs or any other library.

  ```typescript
  import { http, createPublicClient } from "viem";
  import { optimismGoerli } from "viem/chains";
  import { ExampleContract } from "./ExampleContract.sol";

  export const publicClient = createPublicClient({
    chain: optimismGoerli,
    transport: http("https://goerli.optimism.io"),
  });

  const owner = "0x8f0ebdaa1cf7106be861753b0f9f5c0250fe0819";

  publicClient
    .readContract(
      ExampleContract.read({ chainId: optimismGoerli.id }).balanceOf(owner)
    )
    .then(console.log);
  ```

  #### Examples

  A bun example exists in [examples/bun](/examples/bun). This example is very minimal and uses bun with viem in both `bun watch` and `bun test`
  Source code for `@tevm/bun-plugin` with 100% test coverage exists in [bundlers/bun](/bundlers/bun)

### Patch Changes

- Updated dependencies [[`1f80589`](https://github.com/evmts/tevm-monorepo/commit/1f8058969e2b0290f5032166928f76cfc74e9d74)]:
  - @tevm/config@0.9.0
  - @tevm/base@0.9.0
