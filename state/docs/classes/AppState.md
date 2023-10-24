[@evmts/state](/reference/state/README.md) / [Exports](/reference/state/modules.md) / AppState

# Class: AppState

Class representing the EVMts state

## Hierarchy

- [`BaseState`](/reference/state/classes/BaseState.md)<[`AppState`](/reference/state/classes/AppState.md)\>

  ↳ **`AppState`**

## Table of contents

### Constructors

- [constructor](/reference/state/classes/AppState.md#constructor)

### Properties

- [count](/reference/state/classes/AppState.md#count)
- [get](/reference/state/classes/AppState.md#get)
- [set](/reference/state/classes/AppState.md#set)

### Methods

- [createStore](/reference/state/classes/AppState.md#createstore)
- [setCount](/reference/state/classes/AppState.md#setcount)

## Constructors

### constructor

• **new AppState**(`_options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_options` | [`BaseStateOptions`](/reference/state/interfaces/BaseStateOptions.md) |

#### Inherited from

[BaseState](/reference/state/classes/BaseState.md).[constructor](/reference/state/classes/BaseState.md#constructor)

#### Defined in

[BaseState.ts:39](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L39)

## Properties

### count

• `Readonly` **count**: `number` = `0`

Hello world

#### Defined in

[AppState.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/state/src/AppState.ts#L10)

___

### get

• `Protected` **get**: () => [`AppState`](/reference/state/classes/AppState.md)

#### Type declaration

▸ (): [`AppState`](/reference/state/classes/AppState.md)

Get latest zustand state

##### Returns

[`AppState`](/reference/state/classes/AppState.md)

#### Inherited from

[BaseState](/reference/state/classes/BaseState.md).[get](/reference/state/classes/BaseState.md#get)

#### Defined in

[BaseState.ts:27](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L27)

___

### set

• `Protected` **set**: (`stateTransition`: `Partial`<[`AppState`](/reference/state/classes/AppState.md)\> \| (`state`: [`AppState`](/reference/state/classes/AppState.md)) => `Partial`<[`AppState`](/reference/state/classes/AppState.md)\>) => `void`

#### Type declaration

▸ (`stateTransition`): `void`

Set zustand state.   Zustand will automatically
persist the other keys in the state.

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateTransition` | `Partial`<[`AppState`](/reference/state/classes/AppState.md)\> \| (`state`: [`AppState`](/reference/state/classes/AppState.md)) => `Partial`<[`AppState`](/reference/state/classes/AppState.md)\> |

##### Returns

`void`

**`See`**

https://docs.pmnd.rs/zustand/guides/updating-state

#### Inherited from

[BaseState](/reference/state/classes/BaseState.md).[set](/reference/state/classes/BaseState.md#set)

#### Defined in

[BaseState.ts:35](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L35)

## Methods

### createStore

▸ **createStore**(`enableDev?`): `UseBoundStore`<`StoreApi`<`T`\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enableDev` | `boolean` | `false` |

#### Returns

`UseBoundStore`<`StoreApi`<`T`\>\>

zustand store

**`Parameter`**

enableDev

#### Inherited from

[BaseState](/reference/state/classes/BaseState.md).[createStore](/reference/state/classes/BaseState.md#createstore)

#### Defined in

[BaseState.ts:63](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L63)

___

### setCount

▸ `Readonly` **setCount**(`count`): `void`

Hello world

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

`void`

#### Defined in

[AppState.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/state/src/AppState.ts#L14)
