<p align="center">
  An ecosystem of tools to build robust Ethereum applications in TypeScript for Viem
<p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml)
[![NPM Version](https://img.shields.io/npm/v/tevm)](https://www.npmjs.com/package/tevm)
[![Tevm Downloads](https://img.shields.io/npm/dm/tevm.svg)](https://www.npmjs.com/package/tevm)
[![Tevm bundler downloads](https://img.shields.io/npm/dm/@evmts/core.svg)](https://www.npmjs.com/package/@tevm/bundler)
[![Minzipped Size](https://badgen.net/bundlephobia/minzip/tevm)](https://bundlephobia.com/package/tevm@latest)

# tevm-monorepo

Tevm is modular, easy to pick up, and built on top of [viem](https://viem.sh).

Tevm consists of the following modular tools:

- [MemoryClient](https://tevm.sh/learn/clients/): An [anvil-like](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) built on top of viem and specially crafted for TypeScript applications and tests.
- [TevmBundler](https://tevm.sh/learn/solidity-imports/): A [JavaScript bundler](https://www.youtube.com/watch?v=5IG4UmULyoA) that allows you to build your contracts using Webpack, Vite, ESBuild, Bun and any other major bundler.
- [TevmLSP](https://tevm.sh/learn/solidity-imports/#lsp): That brings solidity awareness to all major editors for full end-to-end contract to TypeScript typesafety
- [Contracts](https://tevm.sh/learn/contracts/): A lightweight interface for interacting with contracts using Tevm, Viem and Wagmi.
- [Scripting](https://tevm.sh/learn/scripting/): Similar to [foundry scripting](https://book.getfoundry.sh/tutorials/solidity-scripting) that allows you to execute arbitrary Solidity and have that Solidity also execute arbitrary JavaScript in an easy and typesafe manner

## Examples

- For a tutorial of all of Tevm's major features check out the [getting started guide](https://tevm.sh/getting-started/getting-started/).
- For a minimal live example you can edit in the browser check out the [live stackblitz](https://stackblitz.com/~/github.com/evmts/quick-start?file=src/main.ts).
- Try out [svvy.sh](https://svvy.sh/) by [0xpolarzero](https://x.com/0xpolarzero) for an example of using Tevm and [whatsabi](https://github.com/shazow/whatsabi) to build a network forking and transaction simulating tool. Forked code from it is kept up to date with latest release [here](https://github.com/evmts/tevm-monorepo/tree/main/examples/next).

[<img width="1494" alt="ethereum simulator preview" src="https://github.com/evmts/quick-start/assets/35039927/b7fca77e-9542-42ad-894a-3fe5eb838fed">](https://svvy.sh/)

## MemoryClient

[MemoryClient](https://tevm.sh/learn/clients/) is an [anvil-like ethereum devnet](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) specially crafted for TypeScript applications and tests.

✅ &nbsp;Built on top of viem and supports all Viem apis<br/>
✅ &nbsp;Runs in the browser, Node.js, and Bun<br/>
✅ &nbsp;supports forking akin to [anvil --fork-url](https://github.com/foundry-rs/foundry/tree/master/crates/anvil)<br/>
✅ &nbsp;Can generate EVM traces and access lists<br/>
✅ &nbsp;Http handlers for [running as a server](https://tevm.sh/learn/clients/#using-tevm-over-http) in tests or backends<br/>
✅ &nbsp;Full support for the ethereum JSON-RPC api and anvil_ api<br/>

With MemoryClient you can trivially solve a lot of previously tough to solve problems:

- Executing contract logic locally
- Simulating the result of 1 or more transactions
- Submitting impersonated transactions before estimating gas for a future transaction. E.g. mock approving a token before estimating the cost of transfering it.
- Executing view methods that you wrote yourself and don't exist on the contract
- Running the EVM in the browser without the need for a backend RPC
- And more

### MemoryClient example

```typescript
import { createMemoryClient, http } from 'tevm'
import {optimism} from 'tevm/common'

// To start the memoryClient simply call `createMemoryClient`
const client = createMemoryClient({
  // Memory client supports anvil-like forking
  fork: {transport: http('https://mainnet.optimism.io'),
  common: optimism,
})

// memory client supports the entire viem api
const blockNumber = await client.getBlockNumber()

// memory client can arbitrarily modify accounts
client.tevmSetAccount({
  address: `0x${'69'.repeat(20)}`,
  nonce: 9,
  balance: 420n,
  deployedBytecode: '0x...',
  ...
})

// memory client can impersonate any account
const {data, errors, events, executionGasUsed, logs} = client.tevmContract({
  createTransaction: true,
  address: `0x${'69'.repeat(20)}`,
  abi: [...],
  functionName: 'transferFrom',
  args: [...],
})

const {blockHash} = await client.tevmMine()
```

## Tevm Bundler + LSP

### Tevm Bundler

The [Tevm Bundler](https://tevm.sh/learn/solidity-imports/) is the next generation buildtime tool version of tools like Typechain. The Tevm Bundler removes the need to copy paste abis or set up complicated build pipelines. With the Bundler you can directly import Solidity contracts into your TypeScript files. This brings a TRPC-like experience to Contract-Typescript code.

Tevm also supports code-genning the TypeScript from solidity contracts similar to TypeChain.

The Tevm Bundler builds Contracts and Scripts that modularly work with Viem, Wagmi, Tevm.

```typescript
// import Solidity directly into typescript. The Tevm bundler will compile the contracts to TevmContracts and TevmScripts
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'

console.log(ERC20.abi)
console.log(ERC20.humanReadableAbi)

// use the contracts with wagmi viem or tevm. In this example wagmi
const {data} = useReadContract(
  ERC20.read.balanceOf(`0x${'01'.repeat(20)}`)
)
```

![image](https://github.com/evmts/tevm-monorepo/assets/35039927/705cace8-b7bf-4877-9ea3-dee526daffd6)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/bbff1710-ab5a-41b4-9e88-ade2f04d1568)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/8e3ad2bf-0959-4aac-a30d-1bed29d10dfd)

### Tevm LSP

The TEVM LSP is a ts-plugin that allows your code editor to pick up Types from your solidity imports if using the Tevm Bundler.

- Enables end-to-end typesafety with Solidity and TypeScript
- Shows contract natspec on hover in your TypeScript files
- Go-to-definition takes you directly to the contract definition

![image](https://github.com/evmts/tevm-monorepo/assets/35039927/dc196aa2-d446-4518-aceb-5529f81fbd89)

## Tevm Contracts

Tevm contracts are an extremely lightweight modular abstraction for interacting with `viem`, `wagmi`, and `tevm`. They are created automatically if using the Tevm bundler via importing Solidity but also can be created manually.

They can also be used with ethers to create typesafe contracts.

```typescript
import { createScript} from 'tevm/contract'

const script = createScript({
  name: 'MyScript',
  humanReadableAbi: ['function exampleRead() returns (uint256)', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
}).withAddress('0x123...')

// use with wagmi
useReadContract(script.read.exampleRead())

// use with viem/tevm
client.readContract(script.read.exampleRead())

// even use with ethers to create a typesafe contract
import {Contract} from '@tevm/ethers'
const contract = new Contract(script.address, script.abi, provider)
// this will be typesafe
const res = await contract.read()
```

## Tevm Scripting

Tevm scripting allows arbitrary solidity execution similar to Forge scripts. Instead of cheat codes, Tevm allows you to very easily bring your own cheat codes via executing arbitrary JavaScript. Seee the [Tevm scripting guide](https://tevm.sh/learn/scripting/) for information on how to build scripts.

Because Tevm also allows scripts to execute arbitrary JavaScript scripts can be extremely powerful. As an example, one could [build a library for writing servers in Solidity](https://x.com/FUCORY/status/1794839755693453457)

## [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)

## Visit [Docs (under construction)](https://tevm.sh/) for docs, guides, API and more! 📄

## Contributing 💻

Contributions are encouraged, but please open an issue before doing any major changes to make sure your change will be accepted.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributing information

## License 📄

Most files are licensed under [MIT license](./LICENSE). There are some files that are copied from ethereumjs that inherit the [MPL-2.0](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2). These files are individually marked at the top of the file and are all in the `@tevm/state` `@tevm/blockchain` and other packages that wrap ethereumjs libraries.

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>

