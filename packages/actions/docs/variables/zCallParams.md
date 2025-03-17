[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zCallParams

# Variable: zCallParams

> `const` **zCallParams**: `object`

Defined in: [packages/actions/src/Call/zCallParams.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/zCallParams.js#L4)

## Type declaration

### parse()

> **parse**: (`params`) => `any`

#### Parameters

##### params

`any`

#### Returns

`any`

### safeParse()

> **safeParse**: (`params`) => \{ `data`: `any`; `error`: `undefined`; `success`: `boolean`; \} \| \{ `data`: `undefined`; `error`: \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `format`: () => `object`; \}; `success`: `boolean`; \}

#### Parameters

##### params

`any`

#### Returns

\{ `data`: `any`; `error`: `undefined`; `success`: `boolean`; \} \| \{ `data`: `undefined`; `error`: \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `format`: () => `object`; \}; `success`: `boolean`; \}
