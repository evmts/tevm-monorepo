---
title: Cli
description: Tevm CLI documentation
---

## tevm-run

A very thin [`bun run`](https://bun.sh/docs/cli/run) wrapper that loads the tevm bundler.

**Requirements**

tevm-run requires only [a bun installation](https://bun.sh/docs/installation)

**Usage**

To use create a script in js or ts and run `bunx tevm-run`

```bash
bunx tevm-run ./path/to/my/script.js
```

**Features**

- Requires no configs to use
- Automatically loads tevm compiler
- Supports `tevm.config.json` and `remappings.txt` in cwd
- [autoinstalls](https://bun.sh/docs/runtime/autoimport) any node modules in the script
- Works on both ts and js files

**Example**

- **Important** network imports are still under development and should be available next release.

We can very quickly create a script using tevm bundler to import solidity or network scripts

```typescript
// The tevm compiler is enabled for solidity imports
import { MyContract } from "./MyContract.sol";
// In upcoming release it will support network imports too
import PunkContract from "eth://1:0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb";
// You can pass in custom rpc url in network imports. Otherwise it uses public endpoint.
// tip: anvil and hardhat are supported with regard to chainId thus are not necessary if using default ports
import LocalContract from "eth://900:0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb?rpcurl=http://localhost:5432";
// npm libraries are autoinstalled by bun if they are not detected already
import { createMemoryClient, http } from "tevm";

createMemoryClient({
  fork: { transport: http("http://localhost:5432") },
}).readContract(LocalContract.balanceOf(`0x${"00".repeat(20)}`));
```

To run our script we just use [`bunx`](https://bun.sh/docs/cli/bunx)

```typescript
bunx tevm-run ./script.ts
```

## tevm-gen

Uses the tevm compiler to generate `.d.ts` and `.mjs` files.

**Requirements**

Requires either `tevm` or `@tevm/ts-plugin` to be installed either in node_modules or globally.

**Usage**

```typescript
npx tevm-gen . ./contracts/MyContract.sol
```

**Features**

- tevm-gen is pretty minimal with regard to features and meant to just be used as a simple tool to generate ts from solidity.
- For advanced use cases it's recomdended to use the `@tevm/bundler` package or utilize the generated files in the .tevm cache for any repo set up with the tevm compiler.
