# @tevm/test-node

A utility package for testing applications with Tevm. It provides a simple way to spin up a local, forked Tevm instance with built-in JSON-RPC snapshotting for fast, reliable, and deterministic tests.

## Features

- **Auto-managed Test Server**: Zero-config test server that automatically starts/stops per test file
- **JSON-RPC Snapshotting**: Automatically caches JSON-RPC requests to disk. Subsequent test runs are served from the cache, making them orders of magnitude faster and immune to network flakiness
- **Forking Support**: Test against a fork of any EVM-compatible network
- **Seamless Vitest Integration**: Designed to work perfectly with Vitest's lifecycle hooks
- **Automatic Snapshot Placement**: Snapshots stored in `__rpc_snapshots__/<testFileName>.snap.json` next to test files

## Installation

```bash
pnpm add -D @tevm/test-node vitest
npm install -D @tevm/test-node vitest
```

## Quick Start

```typescript
import { createTestSnapshotClient } from '@tevm/test-node'
import { http } from 'viem'

const client = createTestSnapshotClient({
  fork: {
    transport: http('https://mainnet.optimism.io')
  }
})

// Use in tests
await client.getBlock({ blockNumber: 123456n })
// Snapshots automatically saved to __rpc_snapshots__/yourTest.spec.ts.snap.json
```

## API Reference

### `createTestSnapshotClient(options)`

Creates a memory client with automatic RPC response snapshotting.

**Options:**
- `fork.transport` (required): Viem transport to fork from
- `fork.blockTag?`: Block number to fork from
- `common?`: Chain configuration
- `test.resolveSnapshotPath?`: How to resolve snapshot paths (default: `'vitest'`)
  - `'vitest'`: Automatic resolution using vitest context (places in `__rpc_snapshots__/` subdirectory)
  - `() => string`: Custom function returning full absolute path to snapshot file
- `test.autosave?`: When to save snapshots (default: `'onRequest'`)
  - `'onRequest'`: Save after each cached request
  - `'onStop'`: Save when stopping the server
  - `'onSave'`: Save only when manually calling `saveSnapshots()`

**Returns:**
- All `MemoryClient` properties
- `server.http`: HTTP server instance
- `server.rpcUrl`: URL of running server
- `server.start()`: Start the server
- `server.stop()`: Stop the server (auto-saves if autosave is `'onStop'`)
- `saveSnapshots()`: Manually save snapshots

**Example:**
```typescript
const client = createTestSnapshotClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    blockTag: 123456n
  }
})

await client.server.start()
const block = await client.getBlock({ blockNumber: 123456n })
await client.server.stop()
```

### `createTestSnapshotNode(options)`

Creates a Tevm node with automatic RPC response snapshotting.

**Options:**
- Same as `createTestSnapshotClient`, but accepts `TevmNodeOptions`

**Returns:**
- All `TevmNode` properties
- `server`: Server instance (same as `createTestSnapshotClient`)
- `saveSnapshots()`: Manually save snapshots

**Example:**
```typescript
import { blockNumberProcedure } from '@tevm/actions'

const node = createTestSnapshotNode({
  fork: { transport: http('https://mainnet.optimism.io') }
})

const result = await blockNumberProcedure(node)({
  jsonrpc: '2.0',
  method: 'eth_blockNumber',
  id: 1,
  params: []
})
```

### `createTestSnapshotTransport(options)`

Creates a transport with automatic RPC response snapshotting.

**Options:**
- `transport` (required): Viem transport to wrap
- `test.autosave?`: When to save snapshots (default: `'onRequest'`)

**Returns:**
- `request`: EIP-1193 request function
- `server`: Server instance (same as `createTestSnapshotClient`)
- `saveSnapshots()`: Manually save snapshots

**Example:**
```typescript
const transport = createTestSnapshotTransport({
  transport: http('https://mainnet.optimism.io')
})

const result = await transport.request({
  method: 'eth_getBlockByNumber',
  params: ['0x123', false]
})
```

## Autosave Modes

### `'onRequest'` (default)
Saves snapshots immediately after each cached request. Provides real-time persistence.

```typescript
const client = createTestSnapshotClient({
  fork: { transport: http('https://mainnet.optimism.io') },
  test: { autosave: 'onRequest' } // default, can be omitted
})
```

### `'onStop'`
Saves snapshots only when `server.stop()` is called. Better performance for batch operations.

```typescript
const client = createTestSnapshotClient({
  fork: { transport: http('https://mainnet.optimism.io') },
  test: { autosave: 'onStop' }
})

// No snapshots saved during these calls
await client.getBlock({ blockNumber: 1n })
await client.getBlock({ blockNumber: 2n })

// All snapshots saved here
await client.server.stop()
```

### `'onSave'`
No automatic saving. Complete manual control via `saveSnapshots()`.

```typescript
const client = createTestSnapshotClient({
  fork: { transport: http('https://mainnet.optimism.io') },
  test: { autosave: 'onSave' }
})

await client.getBlock({ blockNumber: 1n })
await client.server.stop() // Does not save

// Manually trigger save
await client.saveSnapshots() // Now saved
```

## Snapshot Location

Snapshots are automatically placed in a `__rpc_snapshots__` subdirectory next to your test file:

```
src/
├── myTest.spec.ts
└── __rpc_snapshots__/
    └── myTest.spec.ts.snap.json
```

No configuration needed - snapshot paths are resolved automatically using Vitest's test context.

## Examples

### Global Setup

```typescript
// vitest.setup.ts
import { createTestSnapshotClient } from '@tevm/test-node'
import { http } from 'viem'
import { afterAll, beforeAll } from 'vitest'

export const client = createTestSnapshotClient({
  fork: {
    transport: http('https://mainnet.optimism.io'),
    blockTag: 123456n
  }
})

beforeAll(() => client.server.start())
afterAll(() => client.server.stop())
```

```typescript
// myTest.spec.ts
import { client } from './vitest.setup'

it('fetches block', async () => {
  const block = await client.getBlock({ blockNumber: 123456n })
  expect(block.number).toBe(123456n)
})
```

### Per-Test Client

```typescript
import { createTestSnapshotClient } from '@tevm/test-node'
import { http } from 'viem'

it('works with local client', async () => {
  const client = createTestSnapshotClient({
    fork: { transport: http('https://mainnet.optimism.io') }
  })

  const block = await client.getBlock({ blockNumber: 1n })
  expect(block.number).toBe(1n)
})
```

### Using with Viem Client

```typescript
import { createMemoryClient } from '@tevm/memory-client'
import { createTestSnapshotTransport } from '@tevm/test-node'
import { http } from 'viem'

const transport = createTestSnapshotTransport({
  transport: http('https://mainnet.optimism.io')
})

const client = createMemoryClient({
  fork: { transport }
})

const block = await client.getBlock({ blockNumber: 1n })
```

### Custom Snapshot Path

```typescript
import { createTestSnapshotClient } from '@tevm/test-node'
import { http } from 'viem'
import path from 'node:path'

const client = createTestSnapshotClient({
  fork: { transport: http('https://mainnet.optimism.io') },
  test: {
    resolveSnapshotPath: () => path.join(process.cwd(), 'custom-snapshots', 'my-test.snap.json')
  }
})

// Snapshots saved to custom-snapshots/my-test.snap.json
```