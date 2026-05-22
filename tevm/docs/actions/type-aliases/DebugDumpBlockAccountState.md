[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugDumpBlockAccountState

# Type Alias: DebugDumpBlockAccountState

> **DebugDumpBlockAccountState** = `object`

Account state in debug_dumpBlock result

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="balance"></a> `balance` | [`Hex`](Hex.md) | Account balance in hex |
| <a id="code"></a> `code?` | [`Hex`](Hex.md) | Contract code (if present) |
| <a id="codehash"></a> `codeHash` | [`Hex`](Hex.md) | Account code hash |
| <a id="nonce"></a> `nonce` | [`Hex`](Hex.md) | Account nonce in hex |
| <a id="root"></a> `root` | [`Hex`](Hex.md) | Account storage root |
| <a id="storage"></a> `storage?` | `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\> | Account storage |
