# @evmts/bun-plugin

## 0.10.0

### Patch Changes

- [#469](https://github.com/evmts/evmts-monorepo/pull/469) [`dbc2da6`](https://github.com/evmts/evmts-monorepo/commit/dbc2da6092eae3a7ec2d2519ea8c04505aa911f6) Thanks [@roninjin10](https://github.com/roninjin10)! - Made @evmts/config loading async

- [#466](https://github.com/evmts/evmts-monorepo/pull/466) [`1c4cbd2`](https://github.com/evmts/evmts-monorepo/commit/1c4cbd2b87abd1c2174fb0d2e7a684367e074440) Thanks [@roninjin10](https://github.com/roninjin10)! - Updated Bun to use native Bun.file api which is more peformant than using `fs`

- [#468](https://github.com/evmts/evmts-monorepo/pull/468) [`e99fcd0`](https://github.com/evmts/evmts-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30) Thanks [@roninjin10](https://github.com/roninjin10)! - Improved peformance via using native Bun FS methods

- [#468](https://github.com/evmts/evmts-monorepo/pull/468) [`e99fcd0`](https://github.com/evmts/evmts-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30) Thanks [@roninjin10](https://github.com/roninjin10)! - Improved peformance of bundler via enabling async mode

  Previously all bundlers including the Bun bundler ran with syncronous IO such as readFileSync. With the introduction of async mode the bundler now is more non blocking when it is bundling now. Solc is still syncronous but all IO is now async.

  @evmts/bundler now takes a File-Access-Object as a param. This FileAccessObject is the same shape as `node:fs` module. Bun uses this generic interace to use native Bun file access.

- Updated dependencies [[`dbc2da6`](https://github.com/evmts/evmts-monorepo/commit/dbc2da6092eae3a7ec2d2519ea8c04505aa911f6), [`1c4cbd2`](https://github.com/evmts/evmts-monorepo/commit/1c4cbd2b87abd1c2174fb0d2e7a684367e074440), [`e99fcd0`](https://github.com/evmts/evmts-monorepo/commit/e99fcd09e530a58fddb0d3fa19be0f5439e74f30), [`cb83c0c`](https://github.com/evmts/evmts-monorepo/commit/cb83c0c81fae63decd7bbdb79b9c3cce2c7e0b8e)]:
  - @evmts/bundler@0.10.0
  - @evmts/config@0.10.0

## 0.9.0

### Minor Changes

- [#460](https://github.com/evmts/evmts-monorepo/pull/460) [`1f80589`](https://github.com/evmts/evmts-monorepo/commit/1f8058969e2b0290f5032166928f76cfc74e9d74) Thanks [@roninjin10](https://github.com/roninjin10)! - Added bun support with the new @evmts/bun-plugin package. This enables solidity files to be imported into bun

  ### Installation

  Install build dependencies

  ```typescript
  bun install -D bun-types @evmts/bun-plugin @evmts/ts-plugin @evmts/core solc
  ```

  ### Setup

  first create a `plugins.ts` file

  ```typescript
  import { evmtsBunPlugin } from "@evmts/bun-plugin";
  import { plugin } from "bun";

  plugin(evmtsBunPlugin());
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
  Source code for `@evmts/bun-plugin` with 100% test coverage exists in [bundlers/bun](/bundlers/bun)

### Patch Changes

- Updated dependencies [[`1f80589`](https://github.com/evmts/evmts-monorepo/commit/1f8058969e2b0290f5032166928f76cfc74e9d74)]:
  - @evmts/config@0.9.0
  - @evmts/bundler@0.9.0
