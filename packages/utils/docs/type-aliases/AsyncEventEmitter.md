[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AsyncEventEmitter

# Type Alias: AsyncEventEmitter\<T\>

> **AsyncEventEmitter**\<`T`\> = `object`

Defined in: [packages/utils/src/index.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L128)

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\> = \{ \}

## Methods

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

Defined in: [packages/utils/src/index.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L132)

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

Defined in: [packages/utils/src/index.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L131)

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

Defined in: [packages/utils/src/index.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L129)

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

Defined in: [packages/utils/src/index.ts:130](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L130)

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

Defined in: [packages/utils/src/index.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L133)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event?

`K`

#### Returns

`void`
