[**tevm**](../../../README.md) • **Docs**

***

[tevm](../../../modules.md) / [bundler/rollup-plugin](../README.md) / rollupPluginTevm

# Function: rollupPluginTevm()

> **rollupPluginTevm**(`options`?): `any`

Rollup plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rollup config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](../../solc/type-aliases/SolcVersions.md)

## Returns

`any`

## Defined in

bundler-packages/rollup/types/rollupPluginTevm.d.ts:73
