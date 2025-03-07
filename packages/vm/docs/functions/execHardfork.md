[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / execHardfork

# Function: execHardfork()

> **execHardfork**(`hardfork`, `preMergeHf`): `string`

Defined in: [packages/vm/src/actions/execHardfork.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/execHardfork.js#L14)

Returns the hardfork excluding the merge hf which has
no effect on the vm execution capabilities.

This is particularly useful in executing/evaluating the transaction
when chain td is not available at many places to correctly set the
hardfork in for e.g. vm or txs or when the chain is not fully synced yet.

## Parameters

### hardfork

`string`

### preMergeHf

`string`

## Returns

`string`

## Throws
