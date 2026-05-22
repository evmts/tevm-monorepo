[**@tevm/whatsabi**](../README.md)

***

[@tevm/whatsabi](../globals.md) / UnknownChainError

# Class: UnknownChainError

Defined in: [bundler-packages/whatsabi/src/resolveContractUri.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L7)

## Extends

- `Error`

## Constructors

### Constructor

> **new UnknownChainError**(`chainId`): `UnknownChainError`

Defined in: [bundler-packages/whatsabi/src/resolveContractUri.js:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L20)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chainId` | `number` | - |

#### Returns

`UnknownChainError`

#### Overrides

`Error.constructor`

## Properties

| Property | Type | Default value | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `"UnknownChainError"` | `'UnknownChainError'` | - | - | [bundler-packages/whatsabi/src/resolveContractUri.js:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L16) |
| <a id="cause"></a> `cause?` | `unknown` | `undefined` | - | `Error.cause` | node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24 |
| <a id="message"></a> `message` | `string` | `undefined` | - | `Error.message` | node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1075 |
| <a id="name"></a> `name` | `"UnknownChainError"` | `'UnknownChainError'` | `Error.name` | - | [bundler-packages/whatsabi/src/resolveContractUri.js:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/resolveContractUri.js#L12) |
| <a id="stack"></a> `stack?` | `string` | `undefined` | - | `Error.stack` | node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1076 |

## Methods

### isError()

> `static` **isError**(`error`): `error is Error`

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.esnext.error.d.ts:21

Indicates whether the argument provided is a built-in Error instance or not.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

`error is Error`

#### Inherited from

`Error.isError`
