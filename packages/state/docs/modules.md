[@tevm/state](/reference/state/README.md) / Exports

# @tevm/state

## Table of contents

### Classes

- [AppState](undefined)
- [BaseState](undefined)

### Interfaces

- [BaseStateOptions](undefined)

## Classes

### AppState

• **AppState**: Class AppState

Class representing the Tevm state

#### Defined in

[AppState.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/AppState.ts#L6)

___

### BaseState

• `Abstract` **BaseState**: Class BaseState\<T\>

The base class that other pieces of state extend from
I made this class based because it reduces the boilerplate
of using zustand with typescript a fair amount

**`See`**

https://docs.pmnd.rs/zustand

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends Object |

#### Defined in

[BaseState.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L23)

## Interfaces

### BaseStateOptions

• **BaseStateOptions**: Interface BaseStateOptions

#### Defined in

[BaseState.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L4)
