---
editUrl: false
next: false
prev: false
title: "rspackPluginTevm"
---

> **rspackPluginTevm**(`options`?): `RspackPluginInstance`

Rspack plugin for tevm. Enables Solidity imports in JavaScript. Once enabled the code
will transform solidity contract imports into Tevm `Contract` instances.

To configure add this plugin to your rspack config and add the ts-plugin to your tsconfig.json

## Parameters

• **options?**

• **options.solc?**: [`SolcVersions`](/reference/tevm/solc/type-aliases/solcversions/)

## Returns

`RspackPluginInstance`

## Defined in

[bundler-packages/rspack/src/rspackPluginTevm.js:75](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/rspack/src/rspackPluginTevm.js#L75)
