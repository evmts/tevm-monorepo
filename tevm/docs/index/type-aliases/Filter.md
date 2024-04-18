**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / Filter

# Type alias: Filter\<TFilterType, TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock\>

> **Filter**\<`TFilterType`, `TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>: `object` & `TFilterType` extends `"event"` ? `object` & `TAbi` extends `Abi` ? `undefined` extends `TEventName` ? `object` : `TArgs` extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> ? `object` : `object` : `object` : `object`

## Type declaration

### id

> **id**: [`Hex`](Hex.md)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `TFilterType`

## Type parameters

• **TFilterType** extends `FilterType` = `"event"`

• **TAbi** extends `Abi` \| readonly `unknown`[] \| `undefined` = `undefined`

• **TEventName** extends `string` \| `undefined` = `undefined`

• **TArgs** extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\>

• **TStrict** extends `boolean` \| `undefined` = `undefined`

• **TFromBlock** extends [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

• **TToBlock** extends [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/types/filter.d.ts:11
