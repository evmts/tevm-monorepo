---
editUrl: false
next: false
prev: false
title: "CreateScript"
---

> **CreateScript**: \<`TName`, `THumanReadableAbi`\>(`{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
}`) => [`Script`](/generated/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>

Type of `createScript` factory function
Creates a tevm Script instance from human readable abi

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
}**: [`CreateScriptParams`](/generated/tevm/contract/type-aliases/createscriptparams/)\<`TName`, `THumanReadableAbi`\>

## Returns

## Example

```typescript
import { type Script, createScript} from 'tevm/contract'

const script: Script = createScript({
  name: 'MyScript',
  humanReadableAbi: ['function exampleRead(): uint256', ...],
  bytecode: '0x123...',
  deployedBytecode: '0x123...',
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

## Example

```typescript
import { type Script, createScript, formatAbi} from 'tevm/contract'
import { formatAbi } from 'tevm/abi'

const script = createScript({
 name: 'MyScript',
 bytecode: '0x123...',
 deployedBytecode: '0x123...',
 humanReadableAbi: formatAbi([
  {
    name: 'balanceOf',
    inputs: [
    {
    name: 'owner',
    type: 'address',
    },
    ],
    outputs: [
    {
    name: 'balance',
    type: 'uint256',
    },
  }
  ]),
 })

## Source

[packages/contract/src/types.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L107)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
