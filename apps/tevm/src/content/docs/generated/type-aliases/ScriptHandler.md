---
editUrl: false
next: false
prev: false
title: "ScriptHandler"
---

> **ScriptHandler**: \<`TAbi`, `TFunctionName`\>(`params`) => `Promise`\<[`ScriptResult`](/generated/type-aliases/scriptresult/)\<`TAbi`, `TFunctionName`\>\>

Executes scripts against the Tevm EVM. By default the script is sandboxed
and the state is reset after each execution unless the `persist` option is set
to true.

## Type parameters

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **TFunctionName** extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

▪ **params**: [`ScriptParams`](/generated/type-aliases/scriptparams/)\<`TAbi`, `TFunctionName`\>

## Returns

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

## Source

vm/api/dist/index.d.ts:1019

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
