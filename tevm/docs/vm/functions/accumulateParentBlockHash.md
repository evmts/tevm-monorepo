[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / accumulateParentBlockHash

# Function: accumulateParentBlockHash()

> **accumulateParentBlockHash**(`vm`): (`currentBlockNumber`, `parentHash`) => `Promise`\<`void`\>

This method runs the logic of EIP 2935 (save blockhashes to state)
It will put the `parentHash` of the block to the storage slot of `block.number - 1` of the history storage contract.
This contract is used to retrieve BLOCKHASHes in EVM if EIP 2935 is activated.
In case that the previous block of `block` is pre-EIP-2935 (so we are on the EIP 2935 fork block), additionally
also add the currently available past blockhashes which are available by BLOCKHASH (so, the past 256 block hashes)

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **currentBlockNumber**: `bigint`

• **parentHash**: `Uint8Array`

### Returns

`Promise`\<`void`\>

## Defined in

packages/vm/types/actions/accumulateParentBlockHash.d.ts:11
