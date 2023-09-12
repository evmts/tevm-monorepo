---
"@evmts/viem": minor
---

Added new package @evmts/viem as a new way to wrap viem with evmts functionality

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
import { publicClient } from './client'

const contract = getContractFromEvmts({
  evmts: await import('./MyContract.sol'),
  publicClient,
})

// 2. Call contract methods, listen to events, etc.
const result = await contract.read.totalSupply()
const unwatch = contract.watchEvent.Transfer(
  { from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' },
  { onLogs(logs) { console.log(logs) } }
)
```
