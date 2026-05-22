[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetNextBlockBaseFeePerGasParams

# Type Alias: AnvilSetNextBlockBaseFeePerGasParams

> **AnvilSetNextBlockBaseFeePerGasParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:354](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L354)

Params for `anvil_setNextBlockBaseFeePerGas` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas` | `readonly` | `bigint` | The base fee per gas to set for the next block (in wei) This is only used for EIP-1559 transactions | [packages/actions/src/anvil/AnvilParams.ts:359](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L359) |
