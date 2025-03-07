[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / VMEvents

# Type Alias: VMEvents

> **VMEvents**: `object`

Defined in: [packages/vm/src/utils/VMEvents.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/VMEvents.ts#L6)

## Type declaration

### afterBlock()

> **afterBlock**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`AfterBlockEvent`](../interfaces/AfterBlockEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### afterTx()

> **afterTx**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`AfterTxEvent`](../interfaces/AfterTxEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### beforeBlock()

> **beforeBlock**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

`Block`

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

`TypedTransaction`

##### resolve?

(`result`?) => `void`

#### Returns

`void`
