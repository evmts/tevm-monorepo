# @tevm/test-node

A utility package for testing applications with Tevm. It provides a simple way to spin up a local, forked Tevm instance with built-in JSON-RPC snapshotting for fast, reliable, and deterministic tests.

## Features

-   **Auto-managed Test Server**: Zero-config test server that automatically starts/stops per test file
-   **JSON-RPC Snapshotting**: Automatically caches JSON-RPC requests to disk. Subsequent test runs are served from the cache, making them orders of magnitude faster and immune to network flakiness
-   **Forking Support**: Test against a fork of any EVM-compatible network
-   **Seamless Vitest Integration**: Designed to work perfectly with Vitest's lifecycle hooks
-   **One Snapshot Per Test File**: Clean organization with snapshots stored in `__snapshots__/[testFileName]/`

## Installation

```bash
pnpm add -D @tevm/test-node vitest
npm install -D @tevm/test-node vitest
```

## Usage

### 1. Configure in vitest.setup.ts

```typescript
import { mainnet } from '@tevm/common'
import { http } from 'viem'
import { afterAll, beforeAll } from 'vitest'
import { createTestSnapshotClient } from '@tevm/test-node'

// Configure once globally
export const client = createTestSnapshotClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    blockTag: 123456n
  },
  common: mainnet,
  test: {
    cacheDir: '.tevm/test-snapshots' // default
  }
})

// If you would like to run a Tevm server in the background
beforeAll(async () => {
  await client.server.start()
})

afterAll(async () => {
  await client.server.stop()
})
```

Or without running the server and with autosave on each request:

```typescript
import { createTestSnapshotClient } from '@tevm/test-node'

const client = createTestSnapshotClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    blockTag: 123456n
  },
  common: mainnet,
  test: {
    // This will save snapshots after every request
    // default is 'onStop', which saves when stopping the server
    autosave: 'onRequest'
  }
})
```

### 2. Use in tests

```typescript
import { it } from 'vitest'
import { client } from './vitest.setup.js'

it('should cache RPC requests', async () => {
  await client.getBlock({ blockNumber: 123456n })
})
```

Snapshots are automatically saved to `.tevm/test-snapshots/[testFileName]/snapshots.json` after all tests (or after calling `client.saveSnapshots()`) and reused on subsequent runs.

## API Reference

### `createTestSnapshotClient(options)`

Create a memory client with snapshotting capabilities.

- `options`: Configuration for the underlying `@tevm/memory-client`
- `options.test.cacheDir?`: Directory for snapshots (default: `.tevm/test-snapshots`)

Returns a client with the following properties:
- `...`: The `MemoryClient` properties
- `server`: HTTP server instance with the following properties:
  - `http`: The HTTP server
  - `rpcUrl`: URL of the running server
  - `start()`: Start the server
  - `stop()`: Stop the server and save snapshots to disk
- `saveSnapshots()`: Save snapshots to disk