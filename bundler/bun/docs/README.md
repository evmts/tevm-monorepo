@evmts/bun-plugin / [Exports](modules.md)

# @evmts/plugin-bun

A bun plugin for importing solidity files.

### Installation

Install build dependencies

```typescript
pnpm install -D bun-types @evmts/bun-plugin @evmts/ts-plugin @evmts/core solc
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
## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
