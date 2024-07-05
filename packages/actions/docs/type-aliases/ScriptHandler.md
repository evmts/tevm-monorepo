[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ScriptHandler

# Type Alias: ~~ScriptHandler()~~

> **ScriptHandler**: \<`TAbi`, `TFunctionName`\>(`params`) => `Promise`\<[`ScriptResult`](ScriptResult.md)\<`TAbi`, `TFunctionName`\>\>

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

• **params**: [`ScriptParams`](ScriptParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ScriptResult`](ScriptResult.md)\<`TAbi`, `TFunctionName`\>\>

## Deprecated

Can use `ContractHandler` instead
Executes scripts against the Tevm EVM. By default the script is sandboxed
and the state is reset after each execution unless the `persist` option is set
to true.

## Examples

```typescript
const res = tevm.script({
  deployedBytecode: '0x6080604...',
  abi: [...],
  function: 'run',
  args: ['hello world']
})
```
Contract handlers provide a more ergonomic way to execute scripts

```typescript
ipmort {MyScript} from './MyScript.s.sol'

const res = tevm.script(
   MyScript.read.run('hello world')
)
```

## Defined in

[packages/actions/src/Script/ScriptHandlerType.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptHandlerType.ts#L32)
