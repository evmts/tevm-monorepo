<p align="center">
  Build powerful TypeScript applications powered by the EVM, simplified
<p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml)
[![NPM Version](https://img.shields.io/npm/v/tevm)](https://www.npmjs.com/package/tevm)
[![NPM Downloads](https://img.shields.io/npm/dm/tevm.svg)](https://www.npmjs.com/package/tevm)
[![Minzipped Size](https://badgen.net/bundlephobia/minzip/tevm)](https://bundlephobia.com/package/tevm@latest)

# tevm-monorepo

Tevm is an ethereum development toolkit that enables solidity compilation and EVM execution directly in your JavaScript environments

## Features

✅ &nbsp;EVM simulations<br/>
✅ &nbsp;forking akin to [anvil --fork-url](https://github.com/foundry-rs/foundry/tree/master/crates/anvil)<br/>
✅ &nbsp;Solidity scripting akin to [foundry scripts](https://book.getfoundry.sh/tutorials/solidity-scripting)<br/>
✅ &nbsp;Compiles contracts in JavaScript via importing solidity files<br/>
✅ &nbsp;Runs in browser, Bun, and Node.js<br/>
✅ &nbsp;Extensions for usage with Viem, Ethers.js, Next.js, and Express.<br/>
✅ &nbsp;Compiles contracts in JavaScript via importing solidity files<br/>
✅ &nbsp;Compiles contracts in JavaScript via importing solidity files<br/>
🏗️ &nbsp;EVM Tracing (coming in upcoming release)<br/>
🏗️ &nbsp;React hook library<br/>
🏗️ &nbsp;First class vue and svelte support<br/>

Tevm runs in all environments

- [All modern browsers](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#browser_compatibility)
- [Node.js >=18](https://nodejs.org/en)
- [Bun](https://bun.sh)

## [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)

## Visit [Docs](https://tevm.sh/) for docs, guides, API and more! 📄

## Code example

Tevm scripting is a simple yet powerful way to program.

1. Write a solidity script `HelloWorld.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

contract HelloWorld {
    function greet(string memory name) public pure returns (string memory) {
        return string(abi.encodePacked("Hello ", name, "!"));
    }
}
```

2. Import the solidity file into a JavaScript or TypeScript file. No need to compile it.

```typescript
import { HelloWorld } from './HelloWorld.sol'

console.log(HelloWorld.abi)
console.log(HelloWorld.bytecode)
```

3. Initialize a [Tevm memory client](./packages/memory-client/docs/functions/createMemoryClient.md) and execute your Script using the [`tevm.script`](./packages/actions-types/docs/type-aliases/ScriptHandler.md) action

```typescript
import { HelloWorld } from './HelloWorld.sol'
import { createMemoryClient } from 'tevm'

const client = createMemoryClient()

const result = await client.script(
  HelloWorld.read.greet('World')
)

console.log(result.data) // Hello world!

```

This is just a small subset of what Tevm offers. See [docs](https://tevm.sh/) for more information.

## Contributing 💻

Contributions are encouraged, but please open an issue before doing any major changes to make sure your change will be accepted.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributing information

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
