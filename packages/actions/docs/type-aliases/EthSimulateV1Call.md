[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1Call

# Type Alias: EthSimulateV1Call

> **EthSimulateV1Call** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:398](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L398)

Parameters for a single simulated call within a block

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="data"></a> `data?` | `readonly` | [`Hex`](Hex.md) | The hash of the method signature and encoded parameters | [packages/actions/src/eth/EthParams.ts:430](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L430) |
| <a id="from"></a> `from?` | `readonly` | [`Address`](Address.md) | The address from which the transaction is sent | [packages/actions/src/eth/EthParams.ts:402](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L402) |
| <a id="gas"></a> `gas?` | `readonly` | `bigint` | The integer of gas provided for the transaction execution | [packages/actions/src/eth/EthParams.ts:410](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L410) |
| <a id="gasprice"></a> `gasPrice?` | `readonly` | `bigint` | The integer of gasPrice used for each paid gas | [packages/actions/src/eth/EthParams.ts:414](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L414) |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `readonly` | `bigint` | The max fee per gas (EIP-1559) | [packages/actions/src/eth/EthParams.ts:418](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L418) |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `readonly` | `bigint` | The max priority fee per gas (EIP-1559) | [packages/actions/src/eth/EthParams.ts:422](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L422) |
| <a id="nonce"></a> `nonce?` | `readonly` | `bigint` | The nonce of the transaction | [packages/actions/src/eth/EthParams.ts:434](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L434) |
| <a id="to"></a> `to?` | `readonly` | [`Address`](Address.md) | The address to which the transaction is addressed | [packages/actions/src/eth/EthParams.ts:406](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L406) |
| <a id="value"></a> `value?` | `readonly` | `bigint` | The integer of value sent with this transaction | [packages/actions/src/eth/EthParams.ts:426](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L426) |
