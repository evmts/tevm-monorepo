[**tevm**](../../../README.md) • **Docs**

***

[tevm](../../../modules.md) / [bundler/rspack-plugin](../README.md) / rspackPluginTevm

# Function: rspackPluginTevm()

> **rspackPluginTevm**(`options`?): `RspackPluginInstance`

Rspack plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rspack config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](../../solc/type-aliases/SolcVersions.md)

## Returns

`RspackPluginInstance`

## Defined in

bundler-packages/rspack/types/rspackPluginTevm.d.ts:73
