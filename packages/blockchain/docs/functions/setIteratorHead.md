[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / setIteratorHead

# Function: setIteratorHead()

> **setIteratorHead**(`baseChain`): (`tag`, `headHash`) => `Promise`\<`void`\>

Defined in: [packages/blockchain/src/actions/setIteratorHead.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/setIteratorHead.js#L8)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseChain` | `BaseChain` | - |

## Returns

> (`tag`, `headHash`): `Promise`\<`void`\>

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tag` | `string` | The tag to save the headHash to |
| `headHash` | `Uint8Array` | The head hash to save |

### Returns

`Promise`\<`void`\>
