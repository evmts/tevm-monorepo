[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmMine

# Function: tevmMine()

> **tevmMine**(`client`, `params`?): `Promise`\<`MineResult`\>

Defined in: [packages/memory-client/src/tevmMine.js:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmMine.js#L49)

A tree-shakeable version of the `tevmMine` action for viem.
Mines blocks in TEVM.

This function allows you to mine blocks in the TEVM, which is necessary for updating the canonical head state.
The result of mining includes an array of block hashes of the mined blocks.

You can customize the mining process with the `blockCount` and `interval` parameters:
- `blockCount`: The number of blocks to mine. Defaults to 1.
- `interval`: The interval between block timestamps in seconds. Defaults to 1.

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

The viem client configured with TEVM transport.

### params?

`MineParams`\<`boolean`\>

Optional parameters for mining blocks.

## Returns

`Promise`\<`MineResult`\>

The result of mining blocks, including an array of block hashes.

## Example

```typescript
import { tevmMine } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  // Mine a single block
  const result = await tevmMine(client)
  console.log('Mined block hashes:', result.blockHashes)

  // Mine 5 blocks with a 10 second interval between each block
  const resultWithParams = await tevmMine(client, { blockCount: 5, interval: 10 })
  console.log('Mined block hashes with params:', resultWithParams.blockHashes)
}

example()
```

## See

 - [MineParams](https://tevm.sh/reference/tevm/actions/type-aliases/mineparams/) for options reference.
 - [MineResult](https://tevm.sh/reference/tevm/actions/type-aliases/mineresult/) for return values reference.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
