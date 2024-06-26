---
editUrl: false
next: false
prev: false
title: "rollupPluginTevm"
---

> **rollupPluginTevm**(`options`?): `Plugin`\<`any`\>

Rollup plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rollup config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](/reference/tevm/solc/type-aliases/solcversions/)

## Returns

`Plugin`\<`any`\>

## Defined in

[bundler-packages/rollup/src/rollupPluginTevm.js:75](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/rollup/src/rollupPluginTevm.js#L75)
