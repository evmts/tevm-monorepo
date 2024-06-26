[**@tevm/vite-plugin**](../README.md) • **Docs**

***

[@tevm/vite-plugin](../globals.md) / vitePluginTevm

# Function: vitePluginTevm()

> **vitePluginTevm**(`options`?): `Plugin`\<`any`\>

Vite plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your vite config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: `SolcVersions`

## Returns

`Plugin`\<`any`\>

## Defined in

[bundler-packages/vite/src/vitePluginTevm.js:73](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/vite/src/vitePluginTevm.js#L73)
