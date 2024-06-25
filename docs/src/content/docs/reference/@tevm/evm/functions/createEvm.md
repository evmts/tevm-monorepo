---
editUrl: false
next: false
prev: false
title: "createEvm"
---

> **createEvm**(`__namedParameters`): `Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

## Parameters

• **\_\_namedParameters**: [`CreateEvmOptions`](/reference/tevm/evm/type-aliases/createevmoptions/)

## Returns

`Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

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

## Defined in

[packages/evm/src/createEvm.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/createEvm.ts#L31)
