[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / ForkOptions

# Interface: ForkOptions

Defined in: [packages/state/src/state-types/ForkOptions.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ForkOptions.ts#L18)

Configuration options for forking from an existing blockchain network.
Used to specify the RPC endpoint and block number to fork from.

## Example

```typescript
import { ForkOptions } from '@tevm/state'
import { http } from 'viem'

const value: ForkOptions = {
  transport: http('https://mainnet.infura.io/v3/your-api-key'),
  blockTag: 'latest'
}
```

## Properties

### blockTag?

> `optional` **blockTag**: `bigint` \| `BlockTag`

Defined in: [packages/state/src/state-types/ForkOptions.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ForkOptions.ts#L20)

***

### transport

> **transport**: \{ `request`: `EIP1193RequestFn`; \} \| `Transport`

Defined in: [packages/state/src/state-types/ForkOptions.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ForkOptions.ts#L19)
