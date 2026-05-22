[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Defined in: [packages/node/src/Filter.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L56)

Internal representation of a registered filter

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blocks"></a> `blocks` | `Block`[] | Stores the blocks | [packages/node/src/Filter.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L85) |
| <a id="created"></a> `created` | `number` | Creation timestamp | [packages/node/src/Filter.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L68) |
| <a id="err"></a> `err` | `Error` \| `undefined` | Error if any | [packages/node/src/Filter.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L93) |
| <a id="id"></a> `id` | `Hex` | Id of the filter | [packages/node/src/Filter.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L60) |
| <a id="installed"></a> `installed` | `object` | Not sure what this is yet | [packages/node/src/Filter.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L89) |
| <a id="logs"></a> `logs` | [`FilterLog`](FilterLog.md)[] | Stores logs | [packages/node/src/Filter.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L77) |
| <a id="logscriteria"></a> `logsCriteria?` | `TODO` | Criteria of the logs https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329 | [packages/node/src/Filter.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L73) |
| <a id="registeredlisteners"></a> `registeredListeners` | (...`args`) => `any`[] | Listeners registered for the filter | [packages/node/src/Filter.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L97) |
| <a id="tx"></a> `tx` | `TypedTransaction`[] | stores tx | [packages/node/src/Filter.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L81) |
| <a id="type"></a> `type` | [`FilterType`](FilterType.md) | The type of the filter | [packages/node/src/Filter.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L64) |
