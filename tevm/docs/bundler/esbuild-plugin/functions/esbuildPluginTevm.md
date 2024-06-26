[**tevm**](../../../README.md) • **Docs**

***

[tevm](../../../modules.md) / [bundler/esbuild-plugin](../README.md) / esbuildPluginTevm

# Function: esbuildPluginTevm()

> **esbuildPluginTevm**(`options`?): `any`

Esbuild plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your esbuild config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](../../solc/type-aliases/SolcVersions.md)

## Returns

`any`

## Defined in

bundler-packages/esbuild/types/esbuildPluginTevm.d.ts:74
