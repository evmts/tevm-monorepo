[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1BlockResult

# Type Alias: EthSimulateV1BlockResult

> **EthSimulateV1BlockResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:411](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L411)

Result of a simulated block containing multiple call results

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `bigint` | The base fee per gas for the block | [packages/actions/src/eth/EthResult.ts:435](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L435) |
| <a id="calls"></a> `calls` | [`EthSimulateV1CallResult`](EthSimulateV1CallResult.md)[] | Results of the simulated calls in this block | [packages/actions/src/eth/EthResult.ts:439](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L439) |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | The gas limit of the block | [packages/actions/src/eth/EthResult.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L427) |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used in the block | [packages/actions/src/eth/EthResult.ts:431](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L431) |
| <a id="hash"></a> `hash` | [`Hex`](Hex.md) | The block hash | [packages/actions/src/eth/EthResult.ts:419](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L419) |
| <a id="number"></a> `number` | `bigint` | The block number | [packages/actions/src/eth/EthResult.ts:415](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L415) |
| <a id="timestamp"></a> `timestamp` | `bigint` | The timestamp of the block | [packages/actions/src/eth/EthResult.ts:423](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L423) |
