[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EncodeEventTopicsParameters

# Type Alias: EncodeEventTopicsParameters\<abi, eventName, hasEvents, allArgs, allErrorNames\>

> **EncodeEventTopicsParameters**\<`abi`, `eventName`, `hasEvents`, `allArgs`, `allErrorNames`\> = `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](../../index/type-aliases/Abi.md)\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `hasEvents` *extends* `true` ? `unknown` : `never`

## Type Declaration

### abi

> **abi**: `abi`

### args?

> `optional` **args?**: `allArgs`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] | [`Abi`](../../index/type-aliases/Abi.md) |
| `eventName` *extends* `ContractEventName`\<`abi`\> \| `undefined` | `ContractEventName`\<`abi`\> |
| `hasEvents` | `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) *extends* `abi` ? `true` : \[[`ExtractAbiEvents`](../../index/type-aliases/ExtractAbiEvents.md)\<`abi`\>\] *extends* \[`never`\] ? `false` : `true` : `true` |
| `allArgs` | `ContractEventArgs`\<`abi`, `eventName` *extends* `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\> |
| `allErrorNames` | `ContractEventName`\<`abi`\> |
