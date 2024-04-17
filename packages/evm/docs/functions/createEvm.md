**@tevm/evm** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/evm](../README.md) / createEvm

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

[packages/evm/src/createEvm.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/createEvm.ts#L9)
