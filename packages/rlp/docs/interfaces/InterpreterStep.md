[@tevm/evm](../README.md) / [Exports](../modules.md) / InterpreterStep

# Interface: InterpreterStep

## Table of contents

### Properties

- [account](InterpreterStep.md#account)
- [address](InterpreterStep.md#address)
- [codeAddress](InterpreterStep.md#codeaddress)
- [depth](InterpreterStep.md#depth)
- [gasLeft](InterpreterStep.md#gasleft)
- [gasRefund](InterpreterStep.md#gasrefund)
- [memory](InterpreterStep.md#memory)
- [memoryWordCount](InterpreterStep.md#memorywordcount)
- [opcode](InterpreterStep.md#opcode)
- [pc](InterpreterStep.md#pc)
- [returnStack](InterpreterStep.md#returnstack)
- [stack](InterpreterStep.md#stack)
- [stateManager](InterpreterStep.md#statemanager)

## Properties

### account

• **account**: `Account`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:94

___

### address

• **address**: `Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:95

___

### codeAddress

• **codeAddress**: `Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:98

___

### depth

• **depth**: `number`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:87

___

### gasLeft

• **gasLeft**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:81

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:82

___

### memory

• **memory**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:96

___

### memoryWordCount

• **memoryWordCount**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:97

___

### opcode

• **opcode**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dynamicFee?` | `bigint` |
| `fee` | `number` |
| `isAsync` | `boolean` |
| `name` | `string` |

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:88

___

### pc

• **pc**: `number`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:86

___

### returnStack

• **returnStack**: `bigint`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:85

___

### stack

• **stack**: `bigint`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:84

___

### stateManager

• **stateManager**: `EVMStateManagerInterface`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/interpreter.d.ts:83
