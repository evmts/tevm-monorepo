[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / GetEventArgs

# Type Alias: GetEventArgs\<abi, eventName, config, abiEvent, args, FailedToParseArgs\>

> **GetEventArgs**\<`abi`, `eventName`, `config`, `abiEvent`, `args`, `FailedToParseArgs`\>: `true` *extends* `FailedToParseArgs` ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `args`

Defined in: node\_modules/.pnpm/viem@2.23.11\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/types/contract.d.ts:72

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[]

• **eventName** *extends* `string`

• **config** *extends* `EventParameterOptions` = `DefaultEventParameterOptions`

• **abiEvent** *extends* [`AbiEvent`](AbiEvent.md) & `object` = `abi` *extends* [`Abi`](Abi.md) ? [`ExtractAbiEvent`](ExtractAbiEvent.md)\<`abi`, `eventName`\> : [`AbiEvent`](AbiEvent.md) & `object`

• **args** = `AbiEventParametersToPrimitiveTypes`\<`abiEvent`\[`"inputs"`\], `config`\>

• **FailedToParseArgs** = \[`args`\] *extends* \[`never`\] ? `true` : `false` \| readonly `unknown`[] *extends* `args` ? `true` : `false`
