[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / Filter

# Type Alias: Filter\<TFilterType, TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock\>

> **Filter**\<`TFilterType`, `TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>: `object` & `TFilterType` *extends* `"event"` ? `object` & `TAbi` *extends* `Abi` ? `undefined` *extends* `TEventName` ? `object` : `TArgs` *extends* `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> ? `object` : `object` : `object` : `object`

## Type declaration

### id

> **id**: [`Hex`](Hex.md)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `TFilterType`

## Type Parameters

• **TFilterType** *extends* `FilterType` = `"event"`

• **TAbi** *extends* `Abi` \| readonly `unknown`[] \| `undefined` = `undefined`

• **TEventName** *extends* `string` \| `undefined` = `undefined`

• **TArgs** *extends* `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\>

• **TStrict** *extends* `boolean` \| `undefined` = `undefined`

• **TFromBlock** *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

• **TToBlock** *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/types/filter.d.ts:11
