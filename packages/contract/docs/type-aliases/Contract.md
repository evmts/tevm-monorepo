**@tevm/contract** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Contract

# Type alias: Contract`<TName, THumanReadableAbi>`

> **Contract**\<`TName`, `THumanReadableAbi`\>: `object`

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends `ReadonlyArray`\<`string`\> |

## Type declaration

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

### bytecode

> **bytecode**?: `undefined`

### deployedBytecode

> **deployedBytecode**?: `undefined`

### events

> **events**: [`Events`](Events.md)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

### name

> **name**: `TName`

### read

> **read**: [`Read`](Read.md)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

### withAddress

> **withAddress**: \<`TAddress`\>(`address`) => `Omit`\<[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`\>, `"read"` \| `"write"` \| `"events"`\> & `object`

#### Type parameters

▪ **TAddress** extends `Address`

#### Parameters

▪ **address**: `TAddress`

### write

> **write**: [`Write`](Write.md)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

## Source

[packages/contract/src/Contract.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
