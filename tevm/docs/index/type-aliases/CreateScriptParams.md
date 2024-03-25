**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > CreateScriptParams

# Type alias: CreateScriptParams`<TName, THumanReadableAbi>`

> **CreateScriptParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Script`](Script.md)\<`TName`, `THumanReadableAbi`\>, `"name"` \| `"humanReadableAbi"` \| `"bytecode"` \| `"deployedBytecode"`\>

Params for creating a [Script](Script.md) instance

## See

[CreateScript](CreateScript.md)

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends readonly `string`[] |

## Source

packages/contract/types/types.d.ts:41

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
