[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AsyncEventEmitter

# Type Alias: AsyncEventEmitter\<T\>

> **AsyncEventEmitter**\<`T`\> = `object`

Defined in: [packages/utils/src/index.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L150)

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\> = \{ \}

## Methods

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

Defined in: [packages/utils/src/index.ts:154](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L154)

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

Defined in: [packages/utils/src/index.ts:153](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L153)

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

Defined in: [packages/utils/src/index.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L151)

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

Defined in: [packages/utils/src/index.ts:152](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L152)

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

Defined in: [packages/utils/src/index.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/index.ts#L155)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event?

`K`

#### Returns

`void`
