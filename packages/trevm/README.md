# @tevm/trevm

Trevm integration for tevm, providing a high-performance Rust-based EVM implementation.

## Installation

```bash
npm install @tevm/trevm
```

## Usage

```typescript
import { createTrevm } from '@tevm/trevm'
import { mainnet } from '@tevm/common'
import { createBlockchain } from '@tevm/blockchain'
import { createStateManager } from '@tevm/state-manager'
import { EthjsAddress } from '@tevm/utils'

const common = mainnet.clone()
const stateManager = createStateManager({ common })
const blockchain = createBlockchain({ common })
const evm = await createTrevm({ common, stateManager, blockchain})

const runCallResult = await evm.runCall({
  to: EthjsAddress.from(`0x${'00'.repeat(20)}`),
  value: 420n,
  skipBalance: true,
})

console.log(runCallResult)
```

## API

This package provides a drop-in replacement for `createEvm` from `@tevm/evm`, using the Rust-based trevm implementation for improved performance and type safety.

### `createTrevm(options)`

Creates a trevm-based EVM instance.

#### Options

- `common`: Ethereumjs common object
- `stateManager`: A custom Tevm state manager
- `blockchain`: Blockchain instance
- `customPrecompiles`: Custom precompiles (optional)
- `profiler`: Enable profiler (optional)
- `allowUnlimitedContractSize`: Enable/disable unlimited contract size (optional)
- `loggingLevel`: The logging level to run the evm at (optional)

#### Returns

Returns an EVM instance with the following methods:

- `runCall(opts)`: Executes a call transaction

## License

MIT