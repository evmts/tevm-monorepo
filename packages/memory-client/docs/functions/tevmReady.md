[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmReady

# Function: tevmReady()

> **tevmReady**(`client`): `Promise`\<`true`\>

A tree-shakeable version of the `tevmReady` action for viem.
Checks if TEVM is ready.

This function ensures that the TEVM is fully initialized and ready for operations.
It resolves to `true` if the TEVM is ready, and throws an error if the VM fails to initialize.

Note: It is not necessary to explicitly call `tevmReady` because all actions implicitly wait for TEVM to be ready.
However, this can be useful if you want to isolate initialization from the action, for example, when running benchmark tests.

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<`true`\>

Resolves when ready, rejects if VM fails to initialize.

## Throws

If the VM fails to initialize.

## Example

```typescript
import { tevmReady } from 'tevm/actions'
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
  try {
    await tevmReady(client)
    console.log('TEVM is ready')
  } catch (error) {
    console.error('Failed to initialize TEVM:', error)
  }
}

example()
```

## See

[TEVM Actions Guide](https://tevm.sh/learn/actions/)

## Defined in

[packages/memory-client/src/tevmReady.js:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmReady.js#L43)
