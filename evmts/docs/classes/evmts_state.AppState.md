[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/state](../modules/evmts_state.md) / AppState

# Class: AppState

[@evmts/state](../modules/evmts_state.md).AppState

Class representing the EVMts state

## Hierarchy

- [`BaseState`](evmts_state.BaseState.md)\<[`AppState`](evmts_state.AppState.md)\>

  ↳ **`AppState`**

## Table of contents

### Constructors

- [constructor](evmts_state.AppState.md#constructor)

### Properties

- [count](evmts_state.AppState.md#count)
- [get](evmts_state.AppState.md#get)
- [set](evmts_state.AppState.md#set)

### Methods

- [createStore](evmts_state.AppState.md#createstore)
- [setCount](evmts_state.AppState.md#setcount)

## Constructors

### constructor

• **new AppState**(`_options?`): [`AppState`](evmts_state.AppState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_options` | [`BaseStateOptions`](../interfaces/evmts_state.BaseStateOptions.md) |

#### Returns

[`AppState`](evmts_state.AppState.md)

#### Inherited from

[BaseState](evmts_state.BaseState.md).[constructor](evmts_state.BaseState.md#constructor)

#### Defined in

[BaseState.ts:39](https://github.com/evmts/evmts-monorepo/blob/main/packages/state/src/BaseState.ts#L39)

## Properties

### count

• `Readonly` **count**: `number` = `0`

Hello world

#### Defined in

[AppState.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/packages/state/src/AppState.ts#L10)

___

### get

• `Protected` **get**: () => [`AppState`](evmts_state.AppState.md)

#### Type declaration

▸ (): [`AppState`](evmts_state.AppState.md)

Get latest zustand state

##### Returns

[`AppState`](evmts_state.AppState.md)

#### Inherited from

[BaseState](evmts_state.BaseState.md).[get](evmts_state.BaseState.md#get)

#### Defined in

[BaseState.ts:27](https://github.com/evmts/evmts-monorepo/blob/main/packages/state/src/BaseState.ts#L27)

___

### set

• `Protected` **set**: (`stateTransition`: `Partial`\<[`AppState`](evmts_state.AppState.md)\> \| (`state`: [`AppState`](evmts_state.AppState.md)) => `Partial`\<[`AppState`](evmts_state.AppState.md)\>) => `void`

#### Type declaration

▸ (`stateTransition`): `void`

Set zustand state.   Zustand will automatically
persist the other keys in the state.

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateTransition` | `Partial`\<[`AppState`](evmts_state.AppState.md)\> \| (`state`: [`AppState`](evmts_state.AppState.md)) => `Partial`\<[`AppState`](evmts_state.AppState.md)\> |

##### Returns

`void`

**`See`**

https://docs.pmnd.rs/zustand/guides/updating-state

#### Inherited from

[BaseState](evmts_state.BaseState.md).[set](evmts_state.BaseState.md#set)

#### Defined in

[BaseState.ts:35](https://github.com/evmts/evmts-monorepo/blob/main/packages/state/src/BaseState.ts#L35)

## Methods

### createStore

▸ **createStore**(`enableDev?`): `UseBoundStore`\<`StoreApi`\<`T`\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `enableDev` | `boolean` | `false` |

#### Returns

`UseBoundStore`\<`StoreApi`\<`T`\>\>

zustand store

**`Parameter`**

enableDev

#### Inherited from

[BaseState](evmts_state.BaseState.md).[createStore](evmts_state.BaseState.md#createstore)

#### Defined in

[BaseState.ts:63](https://github.com/evmts/evmts-monorepo/blob/main/packages/state/src/BaseState.ts#L63)

___

### setCount

▸ **setCount**(`count`): `void`

Hello world

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

`void`

#### Defined in

[AppState.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/packages/state/src/AppState.ts#L14)
