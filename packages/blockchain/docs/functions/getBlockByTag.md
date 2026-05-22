[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / getBlockByTag

# Function: getBlockByTag()

> **getBlockByTag**(`baseChain`): (`blockTag`) => `Promise`\<`Block`\>

Defined in: [packages/blockchain/src/actions/getBlockByTag.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/getBlockByTag.js#L12)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseChain` | `BaseChain` | - |

## Returns

> (`blockTag`): `Promise`\<`Block`\>

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
| `blockTag` | `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> \| `BlockTag` \| `` `0x${string}` `` |

### Returns

`Promise`\<`Block`\>

### Throws

- If the block is not found

### Throw

- If the block tag is invalid}
