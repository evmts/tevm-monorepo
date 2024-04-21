**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GetEventArgs

# Type alias: GetEventArgs`<TAbi, TEventName, TConfig, TAbiEvent, TArgs, FailedToParseArgs>`

> **GetEventArgs**\<`TAbi`, `TEventName`, `TConfig`, `TAbiEvent`, `TArgs`, `FailedToParseArgs`\>: `true` extends `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `TArgs`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] | - |
| `TEventName` extends `string` | - |
| `TConfig` extends `EventParameterOptions` | `DefaultEventParameterOptions` |
| `TAbiEvent` extends `AbiEvent` & `object` | `TAbi` extends `Abi` ? `ExtractAbiEvent`\<`TAbi`, `TEventName`\> : `AbiEvent` & `object` |
| `TArgs` | `AbiEventParametersToPrimitiveTypes`\<`TAbiEvent`[`"inputs"`], `TConfig`\> |
| `FailedToParseArgs` | [`TArgs`] extends [`never`] ? `true` : `false` \| readonly `unknown`[] extends `TArgs` ? `true` : `false` |

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/types/contract.d.ts:68

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
