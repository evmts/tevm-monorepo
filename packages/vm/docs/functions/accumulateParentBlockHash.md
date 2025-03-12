[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / accumulateParentBlockHash

# Function: accumulateParentBlockHash()

> **accumulateParentBlockHash**(`vm`): (`currentBlockNumber`, `parentHash`) => `Promise`\<`void`\>

Defined in: [packages/vm/src/actions/accumulateParentBlockHash.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/accumulateParentBlockHash.ts#L15)

This method runs the logic of EIP 2935 (save blockhashes to state)
It will put the `parentHash` of the block to the storage slot of `block.number - 1` of the history storage contract.
This contract is used to retrieve BLOCKHASHes in EVM if EIP 2935 is activated.
In case that the previous block of `block` is pre-EIP-2935 (so we are on the EIP 2935 fork block), additionally
also add the currently available past blockhashes which are available by BLOCKHASH (so, the past 256 block hashes)

## Parameters

### vm

`BaseVm`

The VM to run on

## Returns

`Function`

Function that accumulates parent block hash

### Parameters

#### currentBlockNumber

`bigint`

#### parentHash

`Uint8Array`

### Returns

`Promise`\<`void`\>
