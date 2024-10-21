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

## Overview

Tevm is modular, easy to pick up, and built on top of [viem](https://viem.sh).

Tevm consists of the following modular tools:

- Tevm Devnet
- Tevm Contracts
- Tevm Bundler

## [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)

## Visit [Docs (under heavy construction)](https://tevm.sh/) for docs, guides, API, and more! 📄

![image](https://github.com/evmts/tevm-monorepo/assets/35039927/705cace8-b7bf-4877-9ea3-dee526daffd6)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/bbff1710-ab5a-41b4-9e88-ade2f04d1568)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/8e3ad2bf-0959-4aac-a30d-1bed29d10dfd)
![image](https://github.com/evmts/tevm-monorepo/assets/35039927/dc196aa2-d446-4518-aceb-5529f81fbd89)

## Contributing 💻

Contributions are encouraged, but please open an issue before making any major changes to ensure your changes will be accepted.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributing information.

## License 📄

Most files are licensed under the [MIT license](./LICENSE). Some files copied from ethereumjs inherit the [MPL-2.0](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2) license. These files are individually marked at the top and are all in the `@tevm/state`, `@tevm/blockchain`, and other packages that wrap ethereumjs libraries.

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
