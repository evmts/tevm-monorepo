[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [evm](../README.md) / createEvm

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

packages/evm/dist/index.d.ts:126
