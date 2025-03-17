[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `object`

Defined in: [packages/actions/src/LoadState/zLoadStateParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/zLoadStateParams.js#L9)

## Type declaration

### parse()

> **parse**: (`value`) => `any`

Parse the load state parameters

#### Parameters

##### value

`unknown`

The value to parse

#### Returns

`any`

- The parsed value

### safeParse()

> **safeParse**: (`value`) => `object`

Safely parse the load state parameters

#### Parameters

##### value

`unknown`

The value to parse

#### Returns

`object`

- The parse result

##### data?

> `optional` **data**: `any`

##### error?

> `optional` **error**: `object`

###### error.format()

> **format**: () => `object`

###### Returns

`object`

###### \_errors

> **\_errors**: `string`[]

###### state?

> `optional` **state**: `object`

###### state.\_errors

> **\_errors**: `string`[]

##### success

> **success**: `boolean`
