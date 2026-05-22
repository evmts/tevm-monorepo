[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthGetProofParams

# Type Alias: EthGetProofParams

> **EthGetProofParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:351](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L351)

Based on the JSON-RPC request for `eth_getProof` procedure (EIP-1186)

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Address`](Address.md) | The address of the account to get the proof for | [packages/actions/src/eth/EthParams.ts:355](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L355) |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](BlockParam.md) | The block tag or block number to get the proof at | [packages/actions/src/eth/EthParams.ts:363](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L363) |
| <a id="storagekeys"></a> `storageKeys` | `readonly` | readonly [`Hex`](Hex.md)[] | An array of storage keys to get proofs for | [packages/actions/src/eth/EthParams.ts:359](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L359) |
