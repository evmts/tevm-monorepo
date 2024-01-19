**@tevm/contract** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Script

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

> **events**: [`Events`](Events.md)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

### name

> **name**: `TName`

### read

> **read**: [`Read`](Read.md)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

### withAddress

> **withAddress**: \<`TAddress`\>(`address`) => [`Script`](Script.md)\<`TName`, `THumanReadableAbi`\> & `object`

#### Type parameters

▪ **TAddress** extends `Address`

#### Parameters

▪ **address**: `TAddress`

### write

> **write**: [`Write`](Write.md)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

## Source

[packages/contract/src/Script.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Script.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
