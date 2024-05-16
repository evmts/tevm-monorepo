---
editUrl: false
next: false
prev: false
title: "createEvm"
---

> **createEvm**(`__namedParameters`): `Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

Creates the Tevm Evm to execute ethereum bytecode
Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)

## Parameters

• **\_\_namedParameters**: [`CreateEvmOptions`](/reference/tevm/evm/type-aliases/createevmoptions/)

## Returns

`Promise`\<[`Evm`](/reference/tevm/evm/classes/evm/)\>

A tevm Evm instance with tevm specific defaults

## Source

[packages/evm/src/createEvm.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/evm/src/createEvm.ts#L10)
