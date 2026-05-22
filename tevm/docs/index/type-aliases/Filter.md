[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Internal representation of a registered filter

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blocks"></a> `blocks` | [`Block`](../../block/classes/Block.md)[] | Stores the blocks |
| <a id="created"></a> `created` | `number` | Creation timestamp |
| <a id="err"></a> `err` | `Error` \| `undefined` | Error if any |
| <a id="id"></a> `id` | [`Hex`](Hex.md) | Id of the filter |
| <a id="installed"></a> `installed` | `object` | Not sure what this is yet |
| <a id="logs"></a> `logs` | [`FilterLog`](../../node/type-aliases/FilterLog.md)[] | Stores logs |
| <a id="logscriteria"></a> `logsCriteria?` | `TODO` | Criteria of the logs https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329 |
| <a id="registeredlisteners"></a> `registeredListeners` | (...`args`) => `any`[] | Listeners registered for the filter |
| <a id="tx"></a> `tx` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[] | stores tx |
| <a id="type"></a> `type` | [`FilterType`](FilterType.md) | The type of the filter |
