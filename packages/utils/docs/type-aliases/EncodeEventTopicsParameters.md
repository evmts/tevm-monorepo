[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EncodeEventTopicsParameters

# Type Alias: EncodeEventTopicsParameters\<abi, eventName, hasEvents, allArgs, allErrorNames\>

> **EncodeEventTopicsParameters**\<`abi`, `eventName`, `hasEvents`, `allArgs`, `allErrorNames`\> = `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](Abi.md)\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `hasEvents` *extends* `true` ? `unknown` : `never`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:14

## Type declaration

### abi

> **abi**: `abi`

### args?

> `optional` **args**: `allArgs`

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

### eventName

`eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` = `ContractEventName`\<`abi`\>

### hasEvents

`hasEvents` = `abi` *extends* [`Abi`](Abi.md) ? [`Abi`](Abi.md) *extends* `abi` ? `true` : \[[`ExtractAbiEvents`](ExtractAbiEvents.md)\<`abi`\>\] *extends* \[`never`\] ? `false` : `true` : `true`

### allArgs

`allArgs` = `ContractEventArgs`\<`abi`, `eventName` *extends* `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>

### allErrorNames

`allErrorNames` = `ContractEventName`\<`abi`\>
