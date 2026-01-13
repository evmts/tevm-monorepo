[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetMinGasPriceParams

# Type Alias: AnvilSetMinGasPriceParams

> **AnvilSetMinGasPriceParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:361](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L361)

Params for `anvil_setMinGasPrice` handler

## Properties

### minGasPrice

> `readonly` **minGasPrice**: `bigint`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:366](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L366)

The minimum gas price to accept for transactions (in wei)
Transactions with a gas price below this value will be rejected
