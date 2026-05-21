[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / decodeEventLog

# Function: decodeEventLog()

> **decodeEventLog**\<`abi`, `eventName`, `topics`, `data`, `strict`\>(`parameters`): `DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/abi/decodeEventLog.d.ts:32

## Type Parameters

### abi

`abi` *extends* readonly `unknown`[] \| [`Abi`](../type-aliases/Abi.md)

### eventName

`eventName` *extends* `string` \| `undefined` = `undefined`

### topics

`topics` *extends* `` `0x${string}` ``[] = `` `0x${string}` ``[]

### data

`data` *extends* `` `0x${string}` `` \| `undefined` = `undefined`

### strict

`strict` *extends* `boolean` = `true`

## Parameters

### parameters

`DecodeEventLogParameters`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

## Returns

`DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>
