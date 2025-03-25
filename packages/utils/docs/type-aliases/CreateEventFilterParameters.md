[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / CreateEventFilterParameters

# Type Alias: CreateEventFilterParameters\<abiEvent, abiEvents, strict, fromBlock, toBlock, _eventName, _args\>

> **CreateEventFilterParameters**\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_eventName`, `_args`\> = `object` & `MaybeExtractEventArgsFromAbi`\<`abiEvents`, `_eventName`\> *extends* infer eventFilterArgs ? \{ `args`: `eventFilterArgs` \| `_args` *extends* `eventFilterArgs` ? `_args` : `never`; `event`: `abiEvent`; `events`: `undefined`; `strict`: `strict`; \} \| \{ `args`: `undefined`; `event`: `abiEvent`; `events`: `undefined`; `strict`: `strict`; \} \| \{ `args`: `undefined`; `event`: `undefined`; `events`: `abiEvents` \| `undefined`; `strict`: `strict`; \} \| \{ `args`: `undefined`; `event`: `undefined`; `events`: `undefined`; `strict`: `undefined`; \} : `object`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/actions/public/createEventFilter.d.ts:13

## Type declaration

### address?

> `optional` **address**: [`Address`](Address.md) \| [`Address`](Address.md)[]

### fromBlock?

> `optional` **fromBlock**: `fromBlock` \| [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md)

### toBlock?

> `optional` **toBlock**: `toBlock` \| [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md)

## Type Parameters

### abiEvent

`abiEvent` *extends* [`AbiEvent`](AbiEvent.md) \| `undefined` = `undefined`

### abiEvents

`abiEvents` *extends* readonly [`AbiEvent`](AbiEvent.md)[] \| readonly `unknown`[] \| `undefined` = `abiEvent` *extends* [`AbiEvent`](AbiEvent.md) ? \[`abiEvent`\] : `undefined`

### strict

`strict` *extends* `boolean` \| `undefined` = `undefined`

### fromBlock

`fromBlock` *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

### toBlock

`toBlock` *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

### _eventName

`_eventName` *extends* `string` \| `undefined` = `MaybeAbiEventName`\<`abiEvent`\>

### _args

`_args` *extends* `MaybeExtractEventArgsFromAbi`\<`abiEvents`, `_eventName`\> \| `undefined` = `undefined`
