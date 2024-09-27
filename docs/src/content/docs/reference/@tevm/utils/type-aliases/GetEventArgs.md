---
editUrl: false
next: false
prev: false
title: "GetEventArgs"
---

> **GetEventArgs**\<`abi`, `eventName`, `config`, `abiEvent`, `args`, `FailedToParseArgs`\>: `true` *extends* `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `args`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **eventName** *extends* `string`

• **config** *extends* `EventParameterOptions` = `DefaultEventParameterOptions`

• **abiEvent** *extends* `AbiEvent` & `object` = `abi` *extends* `Abi` ? `ExtractAbiEvent`\<`abi`, `eventName`\> : `AbiEvent` & `object`

• **args** = `AbiEventParametersToPrimitiveTypes`\<`abiEvent`\[`"inputs"`\], `config`\>

• **FailedToParseArgs** = [`args`] *extends* [`never`] ? `true` : `false` \| readonly `unknown`[] *extends* `args` ? `true` : `false`

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/types/contract.d.ts:72
