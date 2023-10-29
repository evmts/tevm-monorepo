[@evmts/state](/reference/state/README.md) / [Exports](/reference/state/modules.md) / BaseState

# Class: BaseState<T\>

The base class that other pieces of state extend from
I made this class based because it reduces the boilerplate
of using zustand with typescript a fair amount

**`See`**

https://docs.pmnd.rs/zustand

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

## Hierarchy

- **`BaseState`**

  ↳ [`AppState`](/reference/state/classes/AppState.md)

## Table of contents

### Constructors

- [constructor](/reference/state/classes/BaseState.md#constructor)

### Properties

- [\_options](/reference/state/classes/BaseState.md#_options)
- [get](/reference/state/classes/BaseState.md#get)
- [set](/reference/state/classes/BaseState.md#set)

### Methods

- [createStore](/reference/state/classes/BaseState.md#createstore)

## Constructors

### constructor

• **new BaseState**<`T`\>(`_options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_options` | [`BaseStateOptions`](/reference/state/interfaces/BaseStateOptions.md) |

#### Defined in

[BaseState.ts:39](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L39)

## Properties

### \_options

• `Private` `Readonly` **\_options**: [`BaseStateOptions`](/reference/state/interfaces/BaseStateOptions.md)

#### Defined in

[BaseState.ts:40](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L40)

___

### get

• `Protected` **get**: () => `T`

#### Type declaration

▸ (): `T`

Get latest zustand state

##### Returns

`T`

#### Defined in

[BaseState.ts:27](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L27)

___

### set

• `Protected` **set**: (`stateTransition`: `Partial`<`T`\> \| (`state`: `T`) => `Partial`<`T`\>) => `void`

#### Type declaration

▸ (`stateTransition`): `void`

Set zustand state.   Zustand will automatically
persist the other keys in the state.

##### Parameters

| Name | Type |
| :------ | :------ |
| `stateTransition` | `Partial`<`T`\> \| (`state`: `T`) => `Partial`<`T`\> |

##### Returns

`void`

**`See`**

https://docs.pmnd.rs/zustand/guides/updating-state

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

#### Defined in

[BaseState.ts:63](https://github.com/evmts/evmts-monorepo/blob/main/state/src/BaseState.ts#L63)
