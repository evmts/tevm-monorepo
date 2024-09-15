---
editUrl: false
next: false
prev: false
title: "DeployResult"
---

> **DeployResult**: [`CallResult`](/reference/tevm/actions/type-aliases/callresult/)

Represents the result of a contract deployment on TEVM.
This type extends the CallResult type, which includes properties like gas usage, logs, and errors.

## Example

```typescript
import { createClient } from 'viem'
import { deployHandler } from 'tevm/actions'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  })
})

const deployParams = {
  bytecode: '0x6000366000...',
  abi: [{
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  }],
  args: [],
  from: '0xYourAccountAddress',
  gas: 1000000n,
  createTransaction: true
}

const result: DeployResult = await deployHandler(client)(deployParams)
console.log('Deployed contract address:', result.createdAddress)
console.log('Gas used:', result.executionGasUsed)
```

## See

CallResult for a detailed breakdown of the available properties.

## Defined in

[packages/actions/src/Deploy/DeployResult.ts:38](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployResult.ts#L38)
