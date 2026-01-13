[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2CallResult

# Type Alias: EthSimulateV2CallResult

> **EthSimulateV2CallResult** = [`EthSimulateV1CallResult`](EthSimulateV1CallResult.md) & `object`

Defined in: [packages/actions/src/eth/EthResult.ts:551](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L551)

Result of a single simulated call (V2)
Extends V1 with additional debugging information

## Type Declaration

### contractCreated?

> `optional` **contractCreated**: [`ContractCreationEvent`](ContractCreationEvent.md)

Contract creation events if a contract was deployed
V2 feature: provides visibility into contract deployments

### estimatedGas?

> `optional` **estimatedGas**: `bigint`

Estimated gas if gas estimation was requested
V2 feature: accurate gas estimation

### trace?

> `optional` **trace**: [`CallTrace`](CallTrace.md)

Call trace for debugging
V2 feature: detailed execution trace
