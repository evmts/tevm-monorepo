[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / decodeEventLog

# Function: decodeEventLog()

> **decodeEventLog**\<`abi`, `eventName`, `topics`, `data`, `strict`\>(`parameters`): `DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[] | - |
| `eventName` *extends* `string` \| `undefined` | `undefined` |
| `topics` *extends* `` `0x${string}` ``[] | `` `0x${string}` ``[] |
| `data` *extends* `` `0x${string}` `` \| `undefined` | `undefined` |
| `strict` *extends* `boolean` | `true` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `DecodeEventLogParameters`\<`abi`, `eventName`, `topics`, `data`, `strict`\> |

## Returns

`DecodeEventLogReturnType`\<`abi`, `eventName`, `topics`, `data`, `strict`\>
