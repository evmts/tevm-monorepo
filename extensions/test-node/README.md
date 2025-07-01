# @tevm/test-utils

A utility package for testing applications with Tevm. It provides a simple way to spin up a local, forked Tevm instance with built-in JSON-RPC snapshotting for fast, reliable, and deterministic tests.

## Features

-   **Programmatic Test Server**: Easily create and control a Tevm server within your tests.
-   **JSON-RPC Snapshotting**: Automatically caches JSON-RPC requests to disk. Subsequent test runs are served from the cache, making them orders of magnitude faster and immune to network flakiness.
-   **Forking Support**: Test against a fork of any EVM-compatible network.
-   **Seamless Vitest Integration**: Designed to work perfectly with Vitest's lifecycle hooks.

## Installation

```bash
pnpm add -D @tevm/test-node vitest
npm install -D @tevm/test-node vitest
```

## Quick Start

Here’s how to set up `@tevm/test-node` with Vitest to test a contract against a fork of Optimism.

### Step 1: Create a test setup file

Create a file named `vitest.setup.ts` in your project's `src` directory. This file will create a single, shared test client for all your tests.

```typescript:src/vitest.setup.ts
import { createTestSnapshotClient } from '@tevm/test-node'
import { afterAll, beforeAll } from 'vitest'

// Create the test client with your desired fork configuration
export const testClient = createTestSnapshotClient({
  tevm: {
    fork: {
      url: 'https://mainnet.optimism.io',
    },
  },
  snapshot: {
    // Snapshots will be stored in a directory relative to your tests
    dir: '__snapshots__',
  },
})

// Use Vitest hooks to start and stop the server
beforeAll(async () => {
  await testClient.start()
})

afterAll(async () => {
  await testClient.stop()
})
```

### Step 2: Configure Vitest

In your `vitest.config.ts` file, add the setup file to the `setupFiles` array (add it first so the server is started before any other setup files).

```typescript:vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // This tells Vitest to run our setup file before any tests.
    setupFiles: ['./src/vitest.setup.ts'],
  },
})
```

### Step 3: Write Your Tests

Now you can write tests and import the `testClient`, which extends a viem client with Tevm actions, or just create a viem client.

```typescript:src/MyContract.test.ts
import { testClient } from './vitest.setup'
import { assert, describe, it, expect } from 'vitest'
import { MyContract } from './MyContract.sol'

// Get the Tevm memory client:
const client = testClient.tevm

// Or just create a viem client:
const client = createPublicClient({
  transport: http(testClient.rpcUrl),
})

describe('MyContract', () => {
  it('should deploy and have the correct initial value', async () => {
    // The Tevm memory client allows to do such actions:
    const { createdAddress } = await client.tevmDeploy(MyContract, {
      args: [42n],
    })
    assert(createdAddress, 'Contract deployment failed')

    // The first time you run this, it will be a real RPC call to the fork url.
    // Subsequent runs will be instant, served from a snapshot.
    const value = await client.tevmContract(MyContract.withAddress(createdAddress).read.someValue())

    expect(value).toBe(42n)
  })
})
```

The first time you run your tests, it will be slower as it records the RPC requests. Subsequent runs will be significantly faster.

## API Reference

### `createTestSnapshotClient(options)`

-   `options.tevm`: Configuration options for the underlying `@tevm/memory-client`. Use this to set up forking.
-   `options.snapshot`: Configuration options for RPC snapshotting via Polly.js.
    -   `dir`: The directory to store `.har` snapshot files.
-   **Returns**: An object with:
    -   `tevm`: The `MemoryClient` instance.
    -   `start`: An async function that starts the server.
    -   `stop`: An async function that stops the server.
    -   `rpcUrl`: The URL of the running test server.