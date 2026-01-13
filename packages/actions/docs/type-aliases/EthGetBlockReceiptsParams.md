[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthGetBlockReceiptsParams

# Type Alias: EthGetBlockReceiptsParams

> **EthGetBlockReceiptsParams** = \{ `blockHash`: [`Hex`](Hex.md); `blockTag?`: `never`; \} \| \{ `blockHash?`: `never`; `blockTag`: [`BlockParam`](BlockParam.md); \}

Defined in: [packages/actions/src/eth/EthParams.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L227)

Based on the JSON-RPC request for `eth_getBlockReceipts` procedure
