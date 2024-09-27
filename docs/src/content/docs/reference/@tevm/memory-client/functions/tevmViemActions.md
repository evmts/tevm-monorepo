---
editUrl: false
next: false
prev: false
title: "tevmViemActions"
---

> **tevmViemActions**(): (`client`) => [`TevmViemActionsApi`](/reference/tevm/memory-client/type-aliases/tevmviemactionsapi/)

A viem extension that adds TEVM actions to a viem client.
The viem client must already have TEVM support via `createTevmClient` or `createTevmTransport`.

This extension provides a comprehensive set of actions to interact with the TEVM, including calls, contract interactions, deployments, mining, and more.

Note: If you are building a frontend application, you should use the tree-shakable API instead to optimize bundle size.

## Returns

`Function`

The viem extension to add TevmViemActionsApi

### Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

### Returns

[`TevmViemActionsApi`](/reference/tevm/memory-client/type-aliases/tevmviemactionsapi/)

## Example

```typescript
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport, tevmViemActions } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
}).extend(tevmViemActions())

async function example() {
  const account = await client.tevmGetAccount({
    address: '0x123...',
    returnStorage: true,
  })
  console.log(account)
}

example()
```

## See

 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [Viem Client Guide](https://viem.sh/docs/clients/)

## Defined in

[packages/memory-client/src/tevmViemActions.js:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmViemActions.js#L39)
