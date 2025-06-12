# Using Tevm with Deno

This guide explains how to use Tevm in Deno environments, including installation and usage patterns.

## Installation

```bash
deno add npm:tevm
```

## Core Runtime Usage

The main `tevm` package includes only the core runtime dependencies needed for EVM execution. Bundler plugins and build-time dependencies are optional to reduce installation complexity.

### Basic Memory Client

```typescript
import { createMemoryClient } from 'npm:tevm'

const client = createMemoryClient()

// Call a contract
const result = await client.call({
  to: '0x742d35Cc6634C0532925a3b8D94C06c1B1ff9D4E',
  data: '0x...',
})

console.log(result.data)
```

### HTTP Client for Forking

```typescript
import { createHttpClient } from 'npm:tevm/http-client'

const client = createHttpClient({
  url: 'https://mainnet.optimism.io',
})

const result = await client.getAccount({
  address: '0x742d35Cc6634C0532925a3b8D94C06c1B1ff9D4E',
})
```

## Bundler Support (Optional)

If you need bundler functionality, install the specific bundler packages you need:

```bash
# For Vite
deno add npm:@tevm/vite-plugin

# For esbuild  
deno add npm:@tevm/esbuild-plugin

# For Rollup
deno add npm:@tevm/rollup-plugin
```

## Available Submodules

The core `tevm` package provides these submodules:

- `tevm/actions` - JSON-RPC action handlers
- `tevm/address` - Address utilities
- `tevm/block` - Block types and utilities
- `tevm/blockchain` - Blockchain implementation
- `tevm/common` - Common utilities and types
- `tevm/contract` - Contract types and utilities
- `tevm/decorators` - Client decorators
- `tevm/errors` - Error types
- `tevm/evm` - EVM implementation
- `tevm/http-client` - HTTP client implementation
- `tevm/memory-client` - In-memory client
- `tevm/node` - Node implementation
- `tevm/precompiles` - Precompiled contracts
- `tevm/predeploys` - Predeployed contracts
- `tevm/receipt-manager` - Receipt management
- `tevm/server` - Server implementation
- `tevm/state` - State management
- `tevm/tx` - Transaction types and utilities
- `tevm/txpool` - Transaction pool
- `tevm/utils` - Utility functions
- `tevm/vm` - Virtual machine implementation

## Performance Notes

This package structure reduces the dependency tree complexity that was causing installation hangs in Deno. The core runtime is now much lighter and should install quickly.

## Migration from Full Package

If you were previously using bundler functionality from the main package, you'll need to install the specific bundler packages separately:

```typescript
// Old (heavy package)
import { tevmVitePlugin } from 'npm:tevm/bundler/vite-plugin'

// New (separate package)
import { tevmVitePlugin } from 'npm:@tevm/vite-plugin'
```

## Issues

If you encounter installation or runtime issues with Deno, please report them at:
https://github.com/evmts/tevm-monorepo/issues