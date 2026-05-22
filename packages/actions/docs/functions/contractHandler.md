[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / contractHandler

# Function: contractHandler()

> **contractHandler**(`client`, `options?`): [`ContractHandler`](../type-aliases/ContractHandler.md)

Defined in: [packages/actions/src/Contract/contractHandler.js:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/contractHandler.js#L39)

Creates a tree-shakable instance of `contractHandler` for handling contract interactions with the Tevm EVM.
This function uses `callHandler` under the hood to execute contract calls.

Note: This is the internal logic used by higher-level APIs such as `tevmContract`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `options?` | \{ `throwOnFail?`: `boolean`; \} | - |
| `options.throwOnFail?` | `boolean` | - |

## Returns

[`ContractHandler`](../type-aliases/ContractHandler.md)

## Throws

If `throwOnFail` is true; otherwise returned in the result.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { contractHandler } from 'tevm/actions'

const client = createTevmNode()

const contract = contractHandler(client)

const res = await contract({
  to: `0x${'69'.repeat(20)}`,
  abi: [{...}], // ABI array
  functionName: 'myFunction',
  args: [1, 2, 3],
})
```
