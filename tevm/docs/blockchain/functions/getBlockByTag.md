[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / getBlockByTag

# Function: getBlockByTag()

> **getBlockByTag**(`baseChain`): (`blockTag`) => `Promise`\<[`Block`](../../block/classes/Block.md)\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `baseChain` | `BaseChain` |

## Returns

> (`blockTag`): `Promise`\<[`Block`](../../block/classes/Block.md)\>

Gets block given one of the following inputs:
- Hex block hash
- Hex block number (if length is 32 bytes, it is treated as a hash)
- Uint8Array block hash
- Number block number
- BigInt block number
- BlockTag block tag
- Named block tag (e.g. 'latest', 'earliest', 'pending')

### Parameters

| Parameter | Type |
| ------ | ------ |
| `blockTag` | `number` \| `bigint` \| `` `0x${string}` `` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`BlockTag`](../../index/type-aliases/BlockTag.md) |

### Returns

`Promise`\<[`Block`](../../block/classes/Block.md)\>

### Throws

- If the block is not found

### Throw

- If the block tag is invalid}
