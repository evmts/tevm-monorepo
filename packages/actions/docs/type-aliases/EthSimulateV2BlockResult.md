[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2BlockResult

# Type Alias: EthSimulateV2BlockResult

> **EthSimulateV2BlockResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:573](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L573)

Result of a simulated block containing multiple call results (V2)
Extends V1 with streamlined output

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `bigint` | The base fee per gas for the block | [packages/actions/src/eth/EthResult.ts:597](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L597) |
| <a id="calls"></a> `calls` | [`EthSimulateV2CallResult`](EthSimulateV2CallResult.md)[] | Results of the simulated calls in this block | [packages/actions/src/eth/EthResult.ts:605](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L605) |
| <a id="feerecipient"></a> `feeRecipient?` | [`Address`](Address.md) | The fee recipient (coinbase) | [packages/actions/src/eth/EthResult.ts:601](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L601) |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | The gas limit of the block | [packages/actions/src/eth/EthResult.ts:589](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L589) |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used in the block | [packages/actions/src/eth/EthResult.ts:593](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L593) |
| <a id="hash"></a> `hash` | [`Hex`](Hex.md) | The block hash | [packages/actions/src/eth/EthResult.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L581) |
| <a id="number"></a> `number` | `bigint` | The block number | [packages/actions/src/eth/EthResult.ts:577](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L577) |
| <a id="timestamp"></a> `timestamp` | `bigint` | The timestamp of the block | [packages/actions/src/eth/EthResult.ts:585](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L585) |
