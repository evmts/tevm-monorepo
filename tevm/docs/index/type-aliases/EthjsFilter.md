[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EthjsFilter

# Type Alias: EthjsFilter\<filterType, abi, eventName, args, strict, fromBlock, toBlock\>

> **EthjsFilter**\<`filterType`, `abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>: `object` & `filterType` *extends* `"event"` ? `object` & `abi` *extends* [`Abi`](Abi.md) ? `undefined` *extends* `eventName` ? `object` : `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> ? `object` : `object` : `object` : `object`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3/node\_modules/viem/\_types/types/filter.d.ts:11

## Type declaration

### id

> **id**: [`Hex`](Hex.md)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `filterType`

## Type Parameters

• **filterType** *extends* `FilterType` = `"event"`

• **abi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] \| `undefined` = `undefined`

• **eventName** *extends* `string` \| `undefined` = `undefined`

• **args** *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\>

• **strict** *extends* `boolean` \| `undefined` = `undefined`

• **fromBlock** *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

• **toBlock** *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`
