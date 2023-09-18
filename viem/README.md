<p align="center">
  <a href="https://evmts.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Execute solidity scripts in browser
<p>

[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/e2e.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/unit.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/unit.yml)
<a href="https://www.npmjs.com/package/@evmts/core" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/@evmts/core.svg" />
</a>
<a href="https://bundlephobia.com/package/@evmts/core@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@evmts/core" />
</a><a href="#badge">

# @evmts/viem

A [viem](https://viem.sh) extension for integrating viem with EVMts. [Extensions](https://viem.sh/docs/clients/custom.html) allow plugins to decorate viem clients with additional functionality.

## Installation

#### npm:

```bash
npm install @viem/evmts-extension
```

#### pnpm:

```bash
pnpm install @viem/evmts-extension
```
#### bun:

```bash
bun install @viem/evmts-extension
```

#### yarn:

```bash
yarn add @viem/evmts-extension
```
## Basic Usage

```typescript
import { getContractFromEvmts } from '@evmts/viem'
import { MyContract } from './MyContract'
import { publicClient } from './client'

const contract = getContractFromEvmts({
  evmts: MyContract,
  publicClient,
})

// 2. Call contract methods, listen to events, etc.
const result = await contract.read.totalSupply()
const unwatch = contract.watchEvent.Transfer(
  { from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' },
  { onLogs(logs) { console.log(logs) } }
)
```
