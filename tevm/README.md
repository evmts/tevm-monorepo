<p align="center">
  TypeScript programming with the full power of the Ethereum Virtual Machine
<p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml)
<a href="https://www.npmjs.com/package/tevm">
<img src="https://img.shields.io/npm/v/tevm?style=flat" alt="Version">
</a>
<a href="https://www.npmjs.com/package/tevm" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/tevm.svg" />
</a>
<a href="https://bundlephobia.com/package/tevm@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/tevm" />
</a><a href="#badge">

# tevm-monorepo

Tevm is an ethereum development toolkit that offers

- Arbitrary EVM execution and forking akin to [anvil](https://github.com/foundry-rs/foundry/tree/master/crates/anvil)
- A powerful solidity scripting environment akin to [foundry scripts](https://book.getfoundry.sh/tutorials/solidity-scripting)
- Build tooling to create a smooth interface between your Solidity scripts and TypeScript code

```typescript

```

Tevm runs in all environments

- [All modern browsers](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#browser_compatibility)
- [Node.js >=18](https://nodejs.org/en)
- [Bun](https://bun.sh)

## Try it out

Try out our [online frontend example on stackblitz](https://stackblitz.com/~/github.com/evmts/tevm-vite-wagmi-example)

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

const result = await tevm.script(
  HelloWorld.read.greate('World')
)

console.log(result.data) // Hello world!

```

This is just a small subset of what Tevm offers. See [docs](https://tevm.sh/) for more information.

## Contributing 💻

Contributions are encouraged, but please open an issue before doing any major changes to make sure your change will be accepted.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contributing information

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
