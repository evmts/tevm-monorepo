[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EncodeEventTopicsParameters

# Type Alias: EncodeEventTopicsParameters\<abi, eventName, hasEvents, allArgs, allErrorNames\>

> **EncodeEventTopicsParameters**\<`abi`, `eventName`, `hasEvents`, `allArgs`, `allErrorNames`\> = `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](../../index/type-aliases/Abi.md)\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `hasEvents` *extends* `true` ? `unknown` : `never`

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.3\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:14

## Type Declaration

### abi

> **abi**: `abi`

### args?

> `optional` **args**: `allArgs`

## Type Parameters

### abi

`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

### eventName

`eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` = `ContractEventName`\<`abi`\>

### hasEvents

`hasEvents` = `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) *extends* `abi` ? `true` : \[[`ExtractAbiEvents`](../../index/type-aliases/ExtractAbiEvents.md)\<`abi`\>\] *extends* \[`never`\] ? `false` : `true` : `true`

### allArgs

`allArgs` = `ContractEventArgs`\<`abi`, `eventName` *extends* `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>

### allErrorNames

`allErrorNames` = `ContractEventName`\<`abi`\>
