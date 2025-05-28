[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EncodeEventTopicsParameters

# Type Alias: EncodeEventTopicsParameters\<abi, eventName, hasEvents, allArgs, allErrorNames\>

> **EncodeEventTopicsParameters**\<`abi`, `eventName`, `hasEvents`, `allArgs`, `allErrorNames`\> = `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](../../index/type-aliases/Abi.md)\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `hasEvents` *extends* `true` ? `unknown` : `never`

Defined in: node\_modules/.pnpm/viem@2.30.1\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.28/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:14

## Type declaration

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
