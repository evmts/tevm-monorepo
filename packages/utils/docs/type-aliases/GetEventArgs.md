[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / GetEventArgs

# Type alias: GetEventArgs\<TAbi, TEventName, TConfig, TAbiEvent, TArgs, FailedToParseArgs\>

> **GetEventArgs**\<`TAbi`, `TEventName`, `TConfig`, `TAbiEvent`, `TArgs`, `FailedToParseArgs`\>: `true` *extends* `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `TArgs`

## Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[]

• **TEventName** *extends* `string`

• **TConfig** *extends* `EventParameterOptions` = `DefaultEventParameterOptions`

• **TAbiEvent** *extends* `AbiEvent` & `object` = `TAbi` *extends* `Abi` ? `ExtractAbiEvent`\<`TAbi`, `TEventName`\> : `AbiEvent` & `object`

• **TArgs** = `AbiEventParametersToPrimitiveTypes`\<`TAbiEvent`\[`"inputs"`\], `TConfig`\>

• **FailedToParseArgs** = [`TArgs`] *extends* [`never`] ? `true` : `false` \| readonly `unknown`[] *extends* `TArgs` ? `true` : `false`

## Source

node\_modules/.pnpm/viem@2.13.6\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/types/contract.d.ts:68
