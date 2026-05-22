[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTrace

# Type Alias: CallTrace

> **CallTrace** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:504](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L504)

Call trace for V2 debugging

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="calls"></a> `calls?` | `CallTrace`[] | Sub-calls made during this call | [packages/actions/src/eth/EthResult.ts:544](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L544) |
| <a id="error"></a> `error?` | `string` | Error message if the call failed | [packages/actions/src/eth/EthResult.ts:540](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L540) |
| <a id="from"></a> `from` | [`Address`](Address.md) | The sender address | [packages/actions/src/eth/EthResult.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L512) |
| <a id="gas"></a> `gas` | `bigint` | The gas provided | [packages/actions/src/eth/EthResult.ts:524](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L524) |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used | [packages/actions/src/eth/EthResult.ts:528](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L528) |
| <a id="input"></a> `input` | [`Hex`](Hex.md) | The input data | [packages/actions/src/eth/EthResult.ts:532](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L532) |
| <a id="output"></a> `output` | [`Hex`](Hex.md) | The output/return data | [packages/actions/src/eth/EthResult.ts:536](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L536) |
| <a id="to"></a> `to?` | [`Address`](Address.md) | The recipient address (or created contract address) | [packages/actions/src/eth/EthResult.ts:516](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L516) |
| <a id="type"></a> `type` | `string` | The type of call (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2) | [packages/actions/src/eth/EthResult.ts:508](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L508) |
| <a id="value"></a> `value?` | `bigint` | The value transferred | [packages/actions/src/eth/EthResult.ts:520](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L520) |
