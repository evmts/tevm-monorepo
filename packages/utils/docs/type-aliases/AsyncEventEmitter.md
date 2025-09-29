[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AsyncEventEmitter

# Type Alias: AsyncEventEmitter\<T\>

> **AsyncEventEmitter**\<`T`\> = `object`

Defined in: [packages/utils/src/index.ts:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L136)

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\> = \{ \}

## Methods

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

Defined in: [packages/utils/src/index.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L140)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`Parameters`\<`T`\[`K`\]\>

#### Returns

`boolean`

***

### off()

> **off**\<`K`\>(`event`, `listener`): `void`

Defined in: [packages/utils/src/index.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L139)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

`T`\[`K`\]

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `listener`): `void`

Defined in: [packages/utils/src/index.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L137)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

`T`\[`K`\]

#### Returns

`void`

***

### once()

> **once**\<`K`\>(`event`, `listener`): `void`

Defined in: [packages/utils/src/index.ts:138](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L138)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

`T`\[`K`\]

#### Returns

`void`

***

### removeAllListeners()

> **removeAllListeners**\<`K`\>(`event?`): `void`

Defined in: [packages/utils/src/index.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L141)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event?

`K`

#### Returns

`void`
