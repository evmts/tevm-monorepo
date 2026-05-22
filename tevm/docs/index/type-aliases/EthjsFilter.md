[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EthjsFilter

# Type Alias: EthjsFilter\<filterType, abi, eventName, args, strict, fromBlock, toBlock\>

> **EthjsFilter**\<`filterType`, `abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\> = `object` & `filterType` *extends* `"event"` ? `object` & `abi` *extends* [`Abi`](Abi.md) ? `undefined` *extends* `eventName` ? `object` : `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> ? `object` : `object` : `object` : `object`

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
