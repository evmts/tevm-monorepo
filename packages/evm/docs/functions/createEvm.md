[**@tevm/evm**](../README.md) • **Docs**

***

[@tevm/evm](../globals.md) / createEvm

# Function: createEvm()

> **createEvm**(`__namedParameters`): `Promise`\<[`Evm`](../classes/Evm.md)\>

Creates the Tevm Evm to execute ethereum bytecode
Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)

## Parameters

• **\_\_namedParameters**: [`CreateEvmOptions`](../type-aliases/CreateEvmOptions.md)

## Returns

`Promise`\<[`Evm`](../classes/Evm.md)\>

A tevm Evm instance with tevm specific defaults

## Source

[packages/evm/src/createEvm.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/createEvm.ts#L10)
