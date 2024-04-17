**@tevm/contract** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/contract](../README.md) / CreateScriptParams

# Type alias: CreateScriptParams\<TName, THumanReadableAbi\>

> **CreateScriptParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Script`](Script.md)\<`TName`, `THumanReadableAbi`\>, `"name"` \| `"humanReadableAbi"` \| `"bytecode"` \| `"deployedBytecode"`\>

Params for creating a [Script](Script.md) instance

## See

[CreateScript](CreateScript.md)

## Type parameters

• **TName** extends `string`

• **THumanReadableAbi** extends readonly `string`[]

## Source

[types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L56)
