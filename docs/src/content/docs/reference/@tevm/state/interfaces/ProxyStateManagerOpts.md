---
editUrl: false
next: false
prev: false
title: "ProxyStateManagerOpts"
---

## Properties

### expectedBlockTime

> **expectedBlockTime**?: `number`

The expected time between blocks in milliseconds
This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
Defaults to 2000ms (2s)

#### Source

[packages/state/src/ProxyStateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L37)

***

### onCommit

> **onCommit**?: (`stateManager`) => `void`

Called when state manager commits state

Called when state manager commits state

#### Parameters

▪ **stateManager**: [`ProxyStateManager`](/reference/tevm/state/classes/proxystatemanager/)

#### Source

[packages/state/src/ProxyStateManager.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L41)

***

### url

> **url**: `string`

Url to a JSON-RPC provider to proxy state from

#### Source

[packages/state/src/ProxyStateManager.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ProxyStateManager.ts#L31)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
