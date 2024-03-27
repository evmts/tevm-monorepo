---
title: Quick start guide
description: Tevm introduction
---

# Tevm Quick Start Guide

This guide is aimed at getting familiar with the basic of using Tevm with viem. Additional targetted guides exist for specific use cases

- [Using tevm scripts as a more advanced multicall](todo.todo)
- [Using tevm in tests](todo.todo)
- [Writing scripts with Tevm and Bun](todo.todo)
- [Using tevm in the browser to optimistically update](todo.todo)

## Introduction

This guide will get you familiar with the most essential features of Tevm and start interacting with the Ethereum Virtual Machine (EVM) in Node.js or browser environments. By the end of this guide you will understand:

1. How to create a local EVM instance with [`createTevmTransport`](/reference/tevm/viem/)
2. How to add additional actions using the [`tevmViemExtension`]
3. How to streamline your workflow using [`tevm compiler`](/reference/tevm/bun-plugin/functions/bunplugintevm) with the tevm bundler
4. How to write solidity scripts with the [`tevm script action`](/reference/tevm/client-types/type-aliases/tevmclient#script)

## Prerequisites

- [Bun](https://bun.sh/).

This tutorial uses Bun but you can follow along in [Node.js >18.0](https://nodejs.org/en) as well. Bun can be installed with NPM.

```bash
npm install --global bun
```

For more details visit the [Bun Installation Guide](https://bun.sh/docs/installation).

## Creating Your Tevm Project

1. Create a new project directory:

```bash
mkdir tevm-app && cd tevm-app
```

2. Initialize your project with [bun init](https://bun.sh/docs/cli/init):

```bash
bun init
```

3. Install viem and tevm

```bash
bun install viem tevm
```

## Using the TevmTransport

[Viem transports](https://viem.sh/docs/clients/intro.html#transports) are how [viem clients](https://viem.sh/docs/clients/intro.html#clients) interact with Ethereum backends. Tevm allows you to plug in a JavaScript native ethereum backend directly into viem. It's like having anvil in your browser/node/bun environments.

After adding tevm as a transport we will be able to interact with a local fork of optimism, impersonate accounts, simulate contract calls, and more.

1. Open the index.ts file

2. Now initialize a Tevm [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) with [createMemoryClient](/reference/tevm/memory-client/functions/creatememoryclient)

```typescript
import { createMemoryClient } from 'tevm';

const tevm = createMemoryClient({
  fork: {url: 'https://mainnet.optimism.io'}
});
console.log(tevm.mode) // "automine"
``

This initializes an an ethereum VM instance akin to starting anvil but in memory. You can interact with the memory client directly if you wish but in this guide we will skip to connecting it to viem.

3. Create a viem transport using `tevmTransport`

```typescript
import { createMemoryClient, tevmTransport } from 'tevm';

const tevm = createMemoryClient();
const transport = tevmTransport(tevm)
```

4. Now create your viem client with tevm as it's backend

```typescript
import { createMemoryClient, tevmTransport } from 'tevm';
import { createPublicClient } from 'viem'
import { optimism } from 'viem/chains'

const tevm = createMemoryClient({
  fork: {url: 'https://mainnet.optimism.io'}
});
const transport = tevmTransport(tevm)
export const publicClient = createPublicClient({
  chain: optimism,
  transport,
})
```

You can now interact with the tevm ethereum client via viem!

## Adding tevm actions

Tevm also has some special actions for interacting with the Tevm backend in addition to supporting all viem `TestClient` and `PublicClient` methods. To add them to viem client add the `tevmExtension`

```typescript
import { createMemoryClient, tevmTransport, tevmExtension } from 'tevm';
import { createPublicClient } from 'viem'
import { optimism } from 'viem/chains'

const tevm = createMemoryClient({
  fork: {url: 'https://mainnet.optimism.io'}
});
const transport = tevmTransport(tevm)
export const publicClient = createPublicClient({
  chain: optimism,
  transport,
}).extends(tevmExtension())
console.log(publicClient.tevm)
```

