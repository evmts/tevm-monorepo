[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthCallParams

# Type Alias: EthCallParams

> **EthCallParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L26)

Based on the JSON-RPC request for `eth_call` procedure

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="blockoverride"></a> `blockOverride?` | `readonly` | [`BlockOverrideSet`](BlockOverrideSet.md) | The block override set to provide different block values while executing the call | [packages/actions/src/eth/EthParams.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L64) |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](BlockParam.md) | The block number hash or block tag | [packages/actions/src/eth/EthParams.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L56) |
| <a id="data"></a> `data?` | `readonly` | [`Hex`](Hex.md) | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation Defaults to zero data | [packages/actions/src/eth/EthParams.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L51) |
| <a id="from"></a> `from?` | `readonly` | [`Address`](Address.md) | The address from which the transaction is sent. Defaults to zero address | [packages/actions/src/eth/EthParams.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L30) |
| <a id="gas"></a> `gas?` | `readonly` | `bigint` | The integer of gas provided for the transaction execution | [packages/actions/src/eth/EthParams.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L38) |
| <a id="gasprice"></a> `gasPrice?` | `readonly` | `bigint` | The integer of gasPrice used for each paid gas | [packages/actions/src/eth/EthParams.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L42) |
| <a id="stateoverrideset"></a> `stateOverrideSet?` | `readonly` | [`StateOverrideSet`](StateOverrideSet.md) | The state override set to provide different state values while executing the call | [packages/actions/src/eth/EthParams.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L60) |
| <a id="to"></a> `to?` | `readonly` | [`Address`](Address.md) | The address to which the transaction is addressed. Defaults to zero address | [packages/actions/src/eth/EthParams.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L34) |
| <a id="value"></a> `value?` | `readonly` | `bigint` | The integer of value sent with this transaction | [packages/actions/src/eth/EthParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L46) |
