[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / deployHandler

# Function: deployHandler()

> **deployHandler**(`client`, `options?`): [`DeployHandler`](../type-aliases/DeployHandler.md)

Defined in: [packages/actions/src/Deploy/deployHandler.js:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/deployHandler.js#L36)

Creates a tree-shakable instance of `deployHandler` for handling the deployment of contracts to TEVM.
This function uses `callHandler` under the hood to execute the deployment.

Note: This is the internal logic used by higher-level APIs such as `tevmDeploy`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `options?` | \{ `throwOnFail?`: `boolean`; \} | - |
| `options.throwOnFail?` | `boolean` | - |

## Returns

[`DeployHandler`](../type-aliases/DeployHandler.md)

## Throws

If `throwOnFail` is true; otherwise returned in the result.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { deployHandler } from 'tevm/actions'

const client = createTevmNode()

const deploy = deployHandler(client)

const res = await deploy({
  bytecode: '0x...', // Contract bytecode
  abi: [{...}], // ABI array
  args: [1, 2, 3], // Constructor arguments
  createTransaction: true,
})
```
