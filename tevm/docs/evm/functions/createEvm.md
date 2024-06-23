[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [evm](../README.md) / createEvm

# Function: createEvm()

> **createEvm**(`__namedParameters`): `Promise`\<[`Evm`](../classes/Evm.md)\>

Creates the Tevm Evm to execute ethereum bytecode
Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)

## Parameters

• **\_\_namedParameters**: [`CreateEvmOptions`](../type-aliases/CreateEvmOptions.md)

## Returns

`Promise`\<[`Evm`](../classes/Evm.md)\>

A tevm Evm instance with tevm specific defaults
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

const result = await evm.runCall({
  to: EthjsAddress.fromString(`0x${'0'.repeat(40)}`),
  value: 420n,
  skipBalance: true,
})

console.log(result)
```

## Source

packages/evm/dist/index.d.ts:236
