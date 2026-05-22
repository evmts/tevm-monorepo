[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcTransaction

# Type Alias: JsonRpcTransaction

> **JsonRpcTransaction** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L10)

the transaction call object for methods like `eth_call`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data?` | `Hex` | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation | [packages/actions/src/eth/EthJsonRpcRequest.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L34) |
| <a id="from"></a> `from?` | `Address` | The address from which the transaction is sent | [packages/actions/src/eth/EthJsonRpcRequest.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L14) |
| <a id="gas"></a> `gas?` | `Hex` | The integer of gas provided for the transaction execution | [packages/actions/src/eth/EthJsonRpcRequest.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L22) |
| <a id="gasprice"></a> `gasPrice?` | `Hex` | The integer of gasPrice used for each paid gas encoded as hexadecimal | [packages/actions/src/eth/EthJsonRpcRequest.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L26) |
| <a id="nonce"></a> `nonce?` | `Hex` | The integer of the nonce. If not provided a nonce will automatically be generated | [packages/actions/src/eth/EthJsonRpcRequest.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L38) |
| <a id="to"></a> `to?` | `Address` | The address to which the transaction is addressed | [packages/actions/src/eth/EthJsonRpcRequest.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L18) |
| <a id="value"></a> `value?` | `Hex` | The integer of value sent with this transaction encoded as hexadecimal | [packages/actions/src/eth/EthJsonRpcRequest.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L30) |
