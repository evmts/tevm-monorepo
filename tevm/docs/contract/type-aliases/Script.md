**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [contract](../README.md) > Script

# Type alias: Script`<TName, THumanReadableAbi>`

> **Script**\<`TName`, `THumanReadableAbi`\>: `object`

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends `ReadonlyArray`\<`string`\> |

## Type declaration

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

### bytecode

> **bytecode**: `Hex`

### deployedBytecode

> **deployedBytecode**: `Hex`

### events

> **events**: `Events`\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

### name

> **name**: `TName`

### read

> **read**: `Read`\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

### withAddress

> **withAddress**: \<`TAddress`\>(`address`) => [`Script`](Script.md)\<`TName`, `THumanReadableAbi`\> & `object`

#### Type parameters

▪ **TAddress** extends `Address`

#### Parameters

▪ **address**: `TAddress`

### write

> **write**: `Write`\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

## Source

packages/contract/dist/index.d.ts:91

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
