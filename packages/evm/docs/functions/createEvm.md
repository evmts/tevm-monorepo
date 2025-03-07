[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / createEvm

# Function: createEvm()

> **createEvm**(`__namedParameters`): `Promise`\<[`Evm`](../classes/Evm.md)\>

Defined in: [packages/evm/src/createEvm.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/createEvm.js#L30)

Creates the Tevm Evm to execute ethereum bytecode internally.
Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)

## Parameters

### \_\_namedParameters

[`CreateEvmOptions`](../type-aliases/CreateEvmOptions.md)

## Returns

`Promise`\<[`Evm`](../classes/Evm.md)\>

## Example

```typescript
import { createEvm } from '@tevm/evm'
import { mainnet } from '@tevm/common'
import { createBlockchain } from '@tevm/blockchain'
import { createStateManager } from '@tevm/state-manager'
import { EthjsAddress } from '@tevm/utils'

const common = mainnet.clone()
const stateManager = createStateManager({ common })
const blockchain = createBlockchain({ common })
const evm = await createEvm({ common, stateManager, blockchain})

const runCallResult = await evm.runCall({
  to: EthjsAddress.from(`0x${'00'.repeat(20)}`),
  value: 420n,
  skipBalance: true,
})
console.log(runCallResult)
````
@param {import('./CreateEvmOptions.js').CreateEvmOptions} options
@returns {Promise<import('./EvmType.js').Evm>} A tevm Evm instance with tevm specific defaults
