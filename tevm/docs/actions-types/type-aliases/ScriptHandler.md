**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [actions-types](../README.md) / ScriptHandler

# Type alias: ScriptHandler()

> **ScriptHandler**: \<`TAbi`, `TFunctionName`\>(`params`) => `Promise`\<[`ScriptResult`](../../index/type-aliases/ScriptResult.md)\<`TAbi`, `TFunctionName`\>\>

Executes scripts against the Tevm EVM. By default the script is sandboxed
and the state is reset after each execution unless the `persist` option is set
to true.

## Example

```typescript
const res = tevm.script({
  deployedBytecode: '0x6080604...',
  abi: [...],
  function: 'run',
  args: ['hello world']
})
```
Contract handlers provide a more ergonomic way to execute scripts

## Example

```typescript
ipmort {MyScript} from './MyScript.s.sol'

const res = tevm.script(
   MyScript.read.run('hello world')
)
```

## Type parameters

• **TAbi** extends [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

• **TFunctionName** extends [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\>

## Parameters

• **params**: [`ScriptParams`](../../index/type-aliases/ScriptParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ScriptResult`](../../index/type-aliases/ScriptResult.md)\<`TAbi`, `TFunctionName`\>\>

## Source

packages/actions-types/types/handlers/ScriptHandler.d.ts:27
