[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zContractParams

# Variable: zContractParams

> `const` **zContractParams**: `object`

Defined in: [packages/actions/src/Contract/zContractParams.js:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/zContractParams.js#L105)

For backward compatibility with Zod interface

## Type declaration

### parse()

> **parse**: (`value`) => `any`

#### Parameters

##### value

`any`

#### Returns

`any`

### safeParse()

> **safeParse**: (`value`) => \{ `data`: `any`; `success`: `boolean`; \} \| \{ `error`: \{ `format`: () => `object` & `Record`\<`string`, \{ `_errors`: `string`[]; \}\>; \}; `success`: `boolean`; \}

#### Parameters

##### value

`any`

#### Returns

\{ `data`: `any`; `success`: `boolean`; \} \| \{ `error`: \{ `format`: () => `object` & `Record`\<`string`, \{ `_errors`: `string`[]; \}\>; \}; `success`: `boolean`; \}
