[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AsyncEventEmitter

# Type Alias: AsyncEventEmitter\<T\>

> **AsyncEventEmitter**\<`T`\> = `object`

Defined in: packages/utils/src/index.ts:129

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\> = \{ \}

## Methods

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

Defined in: packages/utils/src/index.ts:133

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

Defined in: packages/utils/src/index.ts:132

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

Defined in: packages/utils/src/index.ts:130

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

Defined in: packages/utils/src/index.ts:131

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

Defined in: packages/utils/src/index.ts:134

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event?

`K`

#### Returns

`void`
