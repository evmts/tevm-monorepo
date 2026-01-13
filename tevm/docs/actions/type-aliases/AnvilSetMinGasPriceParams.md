[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetMinGasPriceParams

# Type Alias: AnvilSetMinGasPriceParams

> **AnvilSetMinGasPriceParams** = `object`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:296

Params for `anvil_setMinGasPrice` handler

## Properties

### minGasPrice

> `readonly` **minGasPrice**: `bigint`

Defined in: packages/actions/types/anvil/AnvilParams.d.ts:301

The minimum gas price to accept for transactions (in wei)
Transactions with a gas price below this value will be rejected
