[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / EVMOpts

# Type Alias: EVMOpts

> **EVMOpts** = `ZevmEVMOpts`

The options available to pass to the EVM. Inferred from ZEVM.

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
