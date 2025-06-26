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
import { configureTestClient } from '@tevm/test-node'

// Configure once globally
const client = configureTestClient({
  tevm: {
    fork: {
      transport: http('https://mainnet.optimism.io'),
      blockTag: 123456n
    },
    common: mainnet,
  },
})

const

beforeAll(async () => {
  await client.start()
})

afterAll(async () => {
  await client.destroy()
})
```

### 2. Use in tests

```typescript
import { it } from 'vitest'
import { getTestClient } from '@tevm/test-node'

it('should cache RPC requests', async () => {
  const client = getTestClient()
  await client.tevm.getBlock({ blockNumber: 123456n })
})
```

You can always use a viem client to communicate with the local server.

```typescript
import { createPublicClient, http } from 'viem'
import { getTestClient } from '@tevm/test-node'

const { rpcUrl } = getTestClient()
const client = createPublicClient({
  transport: http(rpcUrl),
})

const block = await client.getBlock({ blockNumber: 123456n })
```

Snapshots are automatically saved to `__snapshots__/[testFileName]/recording.har` and reused on subsequent runs.

## API Reference

### `configureTestClient(options)`

Global configuration for all test clients.

- `options.tevm`: Configuration for the underlying `@tevm/memory-client`
- `options.snapshot.dir?`: Directory for snapshots (default: `__snapshots__`)

### `getTestClient()`

Returns the auto-managed test client for the current test file.

- `tevm`: The `MemoryClient` instance
- `server`: HTTP server instance
- `rpcUrl`: URL of the running server
- `start()`: Start the server
- `stop()`: Stop the server (keeps Polly running)
- `flush()`: Flush recordings to disk without stopping
- `destroy()`: Complete cleanup (server + Polly)