[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateScript

# Type alias: CreateScript()

> **CreateScript**: \<`TName`, `THumanReadableAbi`\>(`{ name, humanReadableAbi, bytecode, deployedBytecode, }`) => [`Script`](Script.md)\<`TName`, `THumanReadableAbi`\>

Type of `createScript` factory function
Creates a tevm Script instance from human readable abi

## Examples

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

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

• **\{ name, humanReadableAbi, bytecode, deployedBytecode, \}**: [`CreateScriptParams`](CreateScriptParams.md)\<`TName`, `THumanReadableAbi`\>

## Returns

[`Script`](Script.md)\<`TName`, `THumanReadableAbi`\>

## Source

packages/contract/types/types.d.ts:85
