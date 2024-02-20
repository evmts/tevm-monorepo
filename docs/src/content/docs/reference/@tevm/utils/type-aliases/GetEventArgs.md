---
editUrl: false
next: false
prev: false
title: "GetEventArgs"
---

> **GetEventArgs**\<`TAbi`, `TEventName`, `TConfig`, `TAbiEvent`, `TArgs`, `FailedToParseArgs`\>: `true` extends `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `TArgs`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] | - |
| `TEventName` extends `string` | - |
| `TConfig` extends `EventParameterOptions` | `DefaultEventParameterOptions` |
| `TAbiEvent` extends [`AbiEvent`](/reference/tevm/utils/type-aliases/abievent/) & `object` | `TAbi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`ExtractAbiEvent`](/reference/tevm/utils/type-aliases/extractabievent/)\<`TAbi`, `TEventName`\> : [`AbiEvent`](/reference/tevm/utils/type-aliases/abievent/) & `object` |
| `TArgs` | `AbiEventParametersToPrimitiveTypes`\<`TAbiEvent`[`"inputs"`], `TConfig`\> |
| `FailedToParseArgs` | [`TArgs`] extends [`never`] ? `true` : `false` \| readonly `unknown`[] extends `TArgs` ? `true` : `false` |

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/types/contract.d.ts:68

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
