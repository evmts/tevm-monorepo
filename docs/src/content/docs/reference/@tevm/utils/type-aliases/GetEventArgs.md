---
editUrl: false
next: false
prev: false
title: "GetEventArgs"
---

> **GetEventArgs**\<`TAbi`, `TEventName`, `TConfig`, `TAbiEvent`, `TArgs`, `FailedToParseArgs`\>: `true` extends `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `TArgs`

## Type parameters

• **TAbi** extends `Abi` \| readonly `unknown`[]

• **TEventName** extends `string`

• **TConfig** extends `EventParameterOptions` = `DefaultEventParameterOptions`

• **TAbiEvent** extends `AbiEvent` & `object` = `TAbi` extends `Abi` ? `ExtractAbiEvent`\<`TAbi`, `TEventName`\> : `AbiEvent` & `object`

• **TArgs** = `AbiEventParametersToPrimitiveTypes`\<`TAbiEvent`\[`"inputs"`\], `TConfig`\>

• **FailedToParseArgs** = [`TArgs`] extends [`never`] ? `true` : `false` \| readonly `unknown`[] extends `TArgs` ? `true` : `false`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/types/contract.d.ts:68
