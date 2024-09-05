<p align="center">
  A library that enables next-generation UX and DX via putting an ethereum node in the browser and solidity in javascript
</p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml)
[![NPM Version](https://img.shields.io/npm/v/tevm)](https://www.npmjs.com/package/tevm)
[![Tevm Downloads](https://img.shields.io/npm/dm/@tevm/memory-client.svg)](https://www.npmjs.com/package/@tevm/memory-client)
[![Tevm Bundler Downloads](https://img.shields.io/npm/dm/@tevm/base-bundler.svg)](https://www.npmjs.com/package/@tevm/base-bundler)
[![Minzipped Size](https://badgen.net/bundlephobia/minzip/tevm)](https://bundlephobia.com/package/tevm@latest)

# tevm-monorepo

Tevm tools include an Ethereum devnet that can run in the Browser and Node.js along with a solidity bundler that allows you to import solidity directly into TypeScript files. All built on top of the viem API.

```typescript
// import solidity directly into typescript
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'

// create a anvil-like devnet directly in TypeScript
const client = createMemoryClient({
  common: optimism,
  fork: {transport: http('https://mainnet.optimism.io')()}
})

// execute the EVM locally in the browser, node.js, deno and Bun
const balance = await client.readContract(
  ERC20
    .withAddress('0x4200000000000000000000000000000000000042')
    .read
    .balanceOf('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
)
```

## Table of Contents
- [Overview](#overview)
- [Examples](#examples)
- [MemoryClient](#memoryclient)
  - [MemoryClient Example](#memoryclient-example)
- [Tevm Bundler + LSP](#tevm-bundler--lsp)
  - [Tevm Bundler](#tevm-bundler)
  - [Tevm LSP](#tevm-lsp)
- [Tevm Contracts](#tevm-contracts)
- [Tevm Scripting](#tevm-scripting)
- [Join Telegram](#join-telegram)
- [Visit Docs](#visit-docs)
- [Contributing](#contributing)
- [License](#license)

## Overview

Tevm is modular, easy to pick up, and built on top of [viem](https://viem.sh).

Tevm consists of the following modular tools:

- Tevm Devnet
- Tevm Contracts
- Tevm Bundler

These tools are modular and can be used by themselves but they also compose very well together with each other and with viem/wagmi.

## Examples

- For a tutorial of all of Tevm's major features, check out the [getting started guide](https://tevm.sh/getting-started/getting-started/).
- For a minimal live example you can edit in the browser, check out the [live StackBlitz](https://stackblitz.com/~/github.com/evmts/quick-start?file=src/main.ts).
- Try out [svvy.sh](https://svvy.sh/) by [0xpolarzero](https://x.com/0xpolarzero) for an example of using Tevm and [whatsabi](https://github.com/shazow/whatsabi) to build a network forking and transaction simulating tool. Forked code from it is kept up to date with the latest release [here](https://github.com/evmts/tevm-monorepo/tree/main/examples/next).

[<img width="1494" alt="ethereum simulator preview" src="https://github.com/evmts/quick-start/assets/35039927/b7fca77e-9542-42ad-894a-3fe5eb838fed">](https://svvy.sh/)

## MemoryClient

[MemoryClient](https://tevm.sh/learn/clients/) is an [anvil-like Ethereum devnet](https://github.com/foundry-rs/foundry/tree/master/crates/anvil) specially crafted for TypeScript applications and tests.

✅ &nbsp;Built on top of viem and supports all Viem APIs<br/>
✅ &nbsp;Runs in the browser, Node.js, and Bun<br/>
✅ &nbsp;Supports forking akin to [anvil --fork-url](https://github.com/foundry-rs/foundry/tree/master/crates/anvil)<br/>
✅ &nbsp;Can generate EVM traces and access lists<br/>
✅ &nbsp;HTTP handlers for [running as a server](https://tevm.sh/learn/clients/#using-tevm-over-http) in tests or backends<br/>
✅ &nbsp;Full support for the Ethereum JSON-RPC API and anvil_ API<br/>

With MemoryClient, you can easily solve a lot of previously tough-to-solve problems:

- Executing contract logic locally
- Simulating the result of one or more transactions
- Submitting impersonated transactions before estimating gas for a future transaction. E.g., mock approving a token before estimating the cost of transferring it.
- Executing view methods that you wrote yourself and don't exist on the contract
- Running the EVM in the browser without the need for a backend RPC
- And more

### MemoryClient Example

```typescript
import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'

// To start the MemoryClient, simply call `createMemoryClient`
const client = createMemoryClient({
  // MemoryClient supports anvil-like forking
  fork: { transport: http('https://mainnet.optimism.io') },
  common: optimism,
})

// MemoryClient supports the entire viem API
const blockNumber = await client.getBlockNumber()

// MemoryClient can arbitrarily modify accounts
client.tevmSetAccount({
  address: `0x${'69'.repeat(20)}`,
  nonce: 9,
  balance: 420n,
  deployedBytecode: '0x...',
  // ...
})

const { data, errors, events, executionGasUsed, logs } = client.tevmContract({
  createTransaction: true,
  // MemoryClient can impersonate any account
  from: `0x${'69'.repeat(20)}`,
  abi: [...],
  functionName: 'transferFrom',
  args: [...],
})

const { blockHash } = await client.tevmMine()
```

## Tevm Bundler + LSP

### Tevm Bundler

The Tevm Bundler is the next-generation build-time tool version of tools like Typechain. The Tevm Bundler removes the need to copy-paste ABIs or set up complicated build pipelines. With the Bundler, you can directly import Solidity contracts into your TypeScript files. This brings a TRPC-like experience to Contract-TypeScript code.

Tevm also supports code-generation of TypeScript from Solidity contracts, similar to TypeChain.

The Tevm Bundler builds Contracts and Scripts that modularly work with Viem, Wagmi, and Tevm.

```typescript
// Import Solidity directly into TypeScript. The Tevm Bundler will compile the contracts to TevmContracts and TevmScripts
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'

console.log(ERC20.abi)
console.log(ERC20.humanReadableAbi)

// Use the contracts with Wagmi, Viem, or Tevm. In this example, Wagmi
const { data } = useReadContract(
  ERC20.read.balanceOf(`0x${'01'.repeat(20)}`)
)
```

![image](https://github.com/evmts/tevm-monorepo/assets/35039927/705cace8-b7bf-4877-9ea3-dee526daffd6)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/bbff1710-ab5a-41b4-9e88-ade2f04d1568)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/8e3ad2bf-0959-4aac-a30d-1bed29d10dfd)

### Tevm LSP

The Tevm LSP is a ts-plugin that allows your code editor to pick up types from your Solidity imports if using the Tevm Bundler.

- Enables end-to-end type safety with Solidity and TypeScript
- Shows contract NatSpec on hover in your TypeScript files
- Go-to-definition takes you directly to the contract definition

![image](https://github.com/evmts/tevm-monorepo/assets/35039927/dc196aa2-d446-4518-aceb-5529f81fbd89)

## Tevm Contracts

Tevm contracts are an extremely lightweight modular abstraction for interacting with viem, wagmi, and tevm. They are created automatically if using the Tevm Bundler via importing Solidity but can also be created manually.

They can also be used with ethers to create type-safe contracts.

```typescript
import { createContract } from 'tevm/contract'

const script = createContract({
  name: 'MyScript',
  humanReadableAbi: ['function exampleRead() returns (uint256)', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
  address: '0x123...'
})

// Use with Wagmi
useReadContract(script.read.exampleRead())

// Use with Viem/Tevm
client.readContract(script.read.exampleRead())

// Even use with ethers to create a type-safe contract
import { Contract } from '@tevm/ethers'
const contract = new Contract(script.address, script.abi, provider)
// This will be type-safe
const res = await contract.read()
```

## Tevm Scripting

Tevm scripting allows arbitrary Solidity execution similar to Forge scripts. Instead of cheat codes, Tevm allows you to very easily bring your own cheat codes via executing arbitrary JavaScript. See the [Tevm scripting guide](https://tevm.sh/learn/scripting/) for information on how to build scripts.

Because Tevm also allows scripts to execute arbitrary JavaScript, scripts can be extremely powerful. For example, one could [build a library for writing servers in Solidity](https://x.com/FUCORY/status/1794839755693453457).

## [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)

## Visit [Docs (under construction)](https://tevm.sh/) for docs, guides, API, and more! 📄

## Contributing 💻

Contributions are encouraged, but please open an issue before making any major changes to ensure your changes will be accepted.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributing information.

## License 📄

Most files are licensed under the [MIT license](./LICENSE). Some files copied from ethereumjs inherit the [MPL-2.0](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2) license. These files are individually marked at the top and are all in the `@tevm/state`, `@tevm/blockchain`, and other packages that wrap ethereumjs libraries.

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
