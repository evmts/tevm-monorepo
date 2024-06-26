[**@tevm/rspack-plugin**](../README.md) • **Docs**

***

[@tevm/rspack-plugin](../globals.md) / rspackPluginTevm

# Function: rspackPluginTevm()

> **rspackPluginTevm**(`options`?): `RspackPluginInstance`

Rspack plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rspack config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: `SolcVersions`

## Returns

`RspackPluginInstance`

## Defined in

[bundler-packages/rspack/src/rspackPluginTevm.js:75](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/rspack/src/rspackPluginTevm.js#L75)
