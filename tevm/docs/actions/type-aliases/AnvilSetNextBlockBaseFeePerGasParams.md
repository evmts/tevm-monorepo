[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetNextBlockBaseFeePerGasParams

# Type Alias: AnvilSetNextBlockBaseFeePerGasParams

> **AnvilSetNextBlockBaseFeePerGasParams** = `object`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:286

Params for `anvil_setNextBlockBaseFeePerGas` handler

## Properties

### baseFeePerGas

> `readonly` **baseFeePerGas**: `bigint`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:291

The base fee per gas to set for the next block (in wei)
This is only used for EIP-1559 transactions
