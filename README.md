![tevm-logo-dark](https://github.com/user-attachments/assets/e9ff4350-5d3f-446b-8425-afd4d73a6d3f)

<p align="center">
  A library that enables next-generation UX and DX via putting an ethereum node in the browser and solidity in javascript
</p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/nx.yml)
[![NPM Version](https://img.shields.io/npm/v/tevm)](https://www.npmjs.com/package/tevm)
[![Tevm Downloads](https://img.shields.io/npm/dm/@tevm/memory-client.svg)](https://www.npmjs.com/package/@tevm/memory-client)
[![Tevm Bundler Downloads](https://img.shields.io/npm/dm/@tevm/base-bundler.svg)](https://www.npmjs.com/package/@tevm/base-bundler)
[![Minzipped Size](https://badgen.net/bundlephobia/minzip/tevm)](https://bundlephobia.com/package/tevm@latest)

# tevm-monorepo

Tevm enables next generation UX for users while providing delightful DX for developers. It's like sticking an RPC node in your web app and making Solidity contracts a first class citizen.

## Visit [New Docs Site!](https://node.tevm.sh/) for docs, guides, API, and more! 📄

- [Tevm node](https://node.tevm.sh)

Here is a code example of what Tevm looks like

```typescript
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

Tevm is able to fork a network similar to anvil in the browser and execute contract calls. You will also notice Tevm Bundler allows us to import contract abis directly from solidity contracts. These powerful primitives are the key to Tevm.

## [Join Telegram](https://t.me/+ANThR9bHDLAwMjUx)

## Contributing 💻

Contributions are encouraged, but please open an issue before making any major changes to ensure your changes will be accepted.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributing information.

## License 📄

Most files are licensed under the [MIT license](./LICENSE). Some files copied from ethereumjs inherit the [MPL-2.0](https://www.tldrlegal.com/license/mozilla-public-license-2-0-mpl-2) license. These files are individually marked at the top and are all in the `@tevm/state`, `@tevm/blockchain`, and other packages that wrap ethereumjs libraries.

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
