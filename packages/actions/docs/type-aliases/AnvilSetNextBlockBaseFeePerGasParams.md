[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetNextBlockBaseFeePerGasParams

# Type Alias: AnvilSetNextBlockBaseFeePerGasParams

> **AnvilSetNextBlockBaseFeePerGasParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:349](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L349)

Params for `anvil_setNextBlockBaseFeePerGas` handler

## Properties

### baseFeePerGas

> `readonly` **baseFeePerGas**: `bigint`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:354](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L354)

The base fee per gas to set for the next block (in wei)
This is only used for EIP-1559 transactions
