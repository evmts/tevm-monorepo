**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [contract](../README.md) > CreateScriptParams

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

packages/contract/dist/index.d.ts:454

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
