[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / accumulateParentBlockHash

# Function: accumulateParentBlockHash()

> **accumulateParentBlockHash**(`vm`): (`currentBlockNumber`, `parentHash`) => `Promise`\<`void`\>

Defined in: [packages/vm/src/actions/accumulateParentBlockHash.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/accumulateParentBlockHash.ts#L12)

This method runs the logic of EIP 2935 (save blockhashes to state)
It will put the `parentHash` of the block to the storage slot of `block.number - 1` of the history storage contract.
This contract is used to retrieve BLOCKHASHes in EVM if EIP 2935 is activated.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vm` | `BaseVm` | The VM to run on |

## Returns

Function that accumulates parent block hash

(`currentBlockNumber`, `parentHash`) => `Promise`\<`void`\>
