[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugDumpBlockResult

# Type Alias: DebugDumpBlockResult

> **DebugDumpBlockResult** = `object`

Result from `debug_dumpBlock`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="accounts"></a> `accounts` | `Record`\<[`Hex`](Hex.md), [`DebugDumpBlockAccountState`](DebugDumpBlockAccountState.md)\> | Accounts in the state |
| <a id="root"></a> `root` | [`Hex`](Hex.md) | State root hash |
