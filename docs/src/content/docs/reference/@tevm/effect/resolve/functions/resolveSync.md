---
editUrl: false
next: false
prev: false
title: "resolveSync"
---

> **resolveSync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `string`\>

Effect wrapper around import('node:resolve').resolveSync

## Parameters

• **importPath**: `string`

• **options**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](/reference/tevm/effect/resolve/classes/couldnotresolveimporterror/), `string`\>

## Defined in

[packages/effect/src/resolve.js:46](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L46)
