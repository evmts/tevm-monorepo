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

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The TEVM base client instance.

### options?

Optional parameters.

#### throwOnFail?

`boolean` = `true`

Whether to throw an error on failure.

## Returns

[`DeployHandler`](../type-aliases/DeployHandler.md)

The deploy handler function.

## Throws

If `throwOnFail` is true, returns `TevmCallError` as value.

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
