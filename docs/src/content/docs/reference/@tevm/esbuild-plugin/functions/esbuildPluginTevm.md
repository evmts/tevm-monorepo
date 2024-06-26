---
editUrl: false
next: false
prev: false
title: "esbuildPluginTevm"
---

> **esbuildPluginTevm**(`options`?): `Plugin`

Esbuild plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your esbuild config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](/reference/tevm/solc/type-aliases/solcversions/)

## Returns

`Plugin`

## Defined in

[bundler-packages/esbuild/src/esbuildPluginTevm.js:76](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/esbuild/src/esbuildPluginTevm.js#L76)
