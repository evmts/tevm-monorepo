[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / delBlock

# Function: delBlock()

> **delBlock**(`baseChain`): (`blockHash`) => `Promise`\<`void`\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `baseChain` | `BaseChain` |

## Returns

> (`blockHash`): `Promise`\<`void`\>

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blockHash` | `Uint8Array` | The hash of the block to be deleted |

### Returns

`Promise`\<`void`\>
