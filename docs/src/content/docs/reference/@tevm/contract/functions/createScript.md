---
editUrl: false
next: false
prev: false
title: "createScript"
---

> **createScript**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Script`](/reference/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>

Creates a Tevm `Script` instance from humanReadableAbi and bytecode

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: [`CreateScriptParams`](/reference/tevm/contract/type-aliases/createscriptparams/)\<`TName`, `THumanReadableAbi`\>

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
import { formatAbi } from 'tevm/utils'

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
 ```

## Source

[createScript.js:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createScript.js#L50)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
