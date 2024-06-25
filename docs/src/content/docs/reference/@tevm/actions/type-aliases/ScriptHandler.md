---
editUrl: false
next: false
prev: false
title: "ScriptHandler"
---

> **ScriptHandler**: \<`TAbi`, `TFunctionName`\>(`params`) => `Promise`\<[`ScriptResult`](/reference/tevm/actions/type-aliases/scriptresult/)\<`TAbi`, `TFunctionName`\>\>

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

:::caution[Deprecated]
Can use `ContractHandler` instead
Executes scripts against the Tevm EVM. By default the script is sandboxed
and the state is reset after each execution unless the `persist` option is set
to true.
:::

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

## Parameters

• **params**: [`ScriptParams`](/reference/tevm/actions/type-aliases/scriptparams/)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ScriptResult`](/reference/tevm/actions/type-aliases/scriptresult/)\<`TAbi`, `TFunctionName`\>\>

## Defined in

[packages/actions/src/Script/ScriptHandlerType.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptHandlerType.ts#L32)
