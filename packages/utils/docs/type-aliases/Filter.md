[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Filter

# Type Alias: Filter\<filterType, abi, eventName, args, strict, fromBlock, toBlock\>

> **Filter**\<`filterType`, `abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\> = `object` & `filterType` *extends* `"event"` ? `object` & `abi` *extends* [`Abi`](Abi.md) ? `undefined` *extends* `eventName` ? `object` : `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> ? `object` : `object` : `object` : `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/filter.d.ts:11

## Type Declaration

### id

> **id**: [`Hex`](Hex.md)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `filterType`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `filterType` *extends* `FilterType` | `"event"` |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] \| `undefined` | `undefined` |
| `eventName` *extends* `string` \| `undefined` | `undefined` |
| `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> \| `undefined` | `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> |
| `strict` *extends* `boolean` \| `undefined` | `undefined` |
| `fromBlock` *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` | `undefined` |
| `toBlock` *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` | `undefined` |
