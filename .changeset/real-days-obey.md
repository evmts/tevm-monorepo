---
"@evmts/bun-plugin": minor
---

Added bun support with the new @evmts/bun-plugin package. This enables solidity files to be imported into bun

### Installation

Install build dependencies

```typescript
bun install -D bun-types @evmts/bun-plugin @evmts/ts-plugin @evmts/core solc
```

### Setup

first create a `plugins.ts` file

```typescript
import { evmtsBunPlugin } from "@evmts/bun-plugin";
import { plugin } from 'bun'

plugin(evmtsBunPlugin())
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
import { http, createPublicClient } from 'viem'
import { optimismGoerli } from 'viem/chains'
import { ExampleContract } from './ExampleContract.sol'

export const publicClient = createPublicClient({
  chain: optimismGoerli,
  transport: http('https://goerli.optimism.io'),
})

const owner = '0x8f0ebdaa1cf7106be861753b0f9f5c0250fe0819'

publicClient.readContract(
  ExampleContract.read({ chainId: optimismGoerli.id }).balanceOf(owner)
).then(console.log)

```
#### Examples

A bun example exists in [examples/bun](/examples/bun). This example is very minimal and uses bun with viem in both `bun watch` and `bun test`
Source code for `@evmts/bun-plugin` with 100% test coverage exists in [bundlers/bun](/bundlers/bun)

