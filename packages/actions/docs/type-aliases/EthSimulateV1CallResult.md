[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1CallResult

# Type Alias: EthSimulateV1CallResult

> **EthSimulateV1CallResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:385](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L385)

Result of a single simulated call

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="error"></a> `error?` | [`SimulateCallError`](SimulateCallError.md) | Error information if the call failed | [packages/actions/src/eth/EthResult.ts:405](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L405) |
| <a id="gasused"></a> `gasUsed` | `bigint` | Gas used by the call | [packages/actions/src/eth/EthResult.ts:397](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L397) |
| <a id="logs"></a> `logs` | [`FilterLog`](FilterLog.md)[] | Logs emitted during the call execution | [packages/actions/src/eth/EthResult.ts:393](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L393) |
| <a id="returndata"></a> `returnData` | [`Hex`](Hex.md) | The return data from the call | [packages/actions/src/eth/EthResult.ts:389](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L389) |
| <a id="status"></a> `status` | `bigint` | Status of the call (1 = success, 0 = failure) | [packages/actions/src/eth/EthResult.ts:401](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L401) |
