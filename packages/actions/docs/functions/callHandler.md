[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / callHandler

# Function: callHandler()

> **callHandler**(`client`, `options?`): [`CallHandler`](../type-aliases/CallHandler.md)

Defined in: [packages/actions/src/Call/callHandler.js:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandler.js#L57)

Creates a tree-shakable instance of [`client.tevmCall`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#call) action.
This function is designed for use with TevmNode and the internal instance of TEVM,
and it is distinct from the viem API `tevmCall`.

Note: This is the internal logic used by higher-level APIs such as `tevmCall`.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM base client instance.

### options?

Optional parameters.

#### throwOnFail?

`boolean` = `true`

Whether to throw an error on failure.

## Returns

[`CallHandler`](../type-aliases/CallHandler.md)

The call handler function.

## Throws

If `throwOnFail` is true, returns `TevmCallError` as value.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { callHandler } from 'tevm/actions'

const client = createTevmNode()

const call = callHandler(client)

// Add transaction to mempool (requires mining later)
const res = await call({
  addToMempool: true,
  to: `0x${'69'.repeat(20)}`,
  value: 420n,
  skipBalance: true,
})
await client.tevmMine()

// Or add transaction to blockchain directly (automatically mines)
const autoMinedRes = await call({
  addToBlockchain: true,
  to: `0x${'69'.repeat(20)}`,
  value: 420n,
  skipBalance: true,
})
```
