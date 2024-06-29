[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmDeploy

# Function: tevmDeploy()

> **tevmDeploy**(`client`, `params`): `Promise`\<`DeployResult`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: `DeployParams`\<`boolean`, `Abi`, `true`, readonly `unknown`[]\>

Parameters for the contract deployment, including ABI, bytecode, and constructor arguments.

## Returns

`Promise`\<`DeployResult`\>

The result of the contract deployment, including the created contract address.

## Defined in

[packages/memory-client/src/tevmDeploy.js:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDeploy.js#L87)
