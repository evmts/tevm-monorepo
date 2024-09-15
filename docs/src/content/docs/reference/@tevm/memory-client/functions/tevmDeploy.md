---
editUrl: false
next: false
prev: false
title: "tevmDeploy"
---

> **tevmDeploy**(`client`, `params`): `Promise`\<[`DeployResult`](/reference/tevm/actions/type-aliases/deployresult/)\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: [`DeployParams`](/reference/tevm/actions/type-aliases/deployparams/)\<`boolean`, [`Abi`](/reference/tevm/utils/type-aliases/abi/), `true`, readonly `unknown`[]\>

Parameters for the contract deployment, including ABI, bytecode, and constructor arguments.

## Returns

`Promise`\<[`DeployResult`](/reference/tevm/actions/type-aliases/deployresult/)\>

The result of the contract deployment, including the created contract address.

## Defined in

[packages/memory-client/src/tevmDeploy.js:87](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmDeploy.js#L87)
