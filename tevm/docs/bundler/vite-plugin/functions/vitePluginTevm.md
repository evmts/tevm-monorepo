[**tevm**](../../../README.md) • **Docs**

***

[tevm](../../../modules.md) / [bundler/vite-plugin](../README.md) / vitePluginTevm

# Function: vitePluginTevm()

> **vitePluginTevm**(`options`?): `Plugin`\<`any`\>

Vite plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your vite config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](../../solc/type-aliases/SolcVersions.md)

## Returns

`Plugin`\<`any`\>

## Defined in

bundler-packages/vite/types/vitePluginTevm.d.ts:71
