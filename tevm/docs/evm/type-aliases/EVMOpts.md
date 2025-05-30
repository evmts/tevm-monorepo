[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EVMOpts

# Type Alias: EVMOpts

> **EVMOpts** = `EVMOpts$1`

Defined in: packages/evm/dist/index.d.ts:68

The options available to pass to the EVM. Inferred from ethereumjs/evm

## See

https://github.com/ethereumjs/ethereumjs-monorepo/pull/3334

## Example

```typescript
import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
import { mainnet } from 'tevm/common'
import { createStateManager } from 'tevm/state'
import { createBlockchain } from 'tevm/blockchain'}
import { EthjsAddress } from 'tevm/utils'

const evm: Evm = createEvm({
  common: mainnet.copy(),
  stateManager: createStateManager(),
  blockchain: createBlockchain(),
})
```
