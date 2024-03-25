[@tevm/evm](../README.md) / [Exports](../modules.md) / EthjsMessage

# Class: EthjsMessage

## Table of contents

### Constructors

- [constructor](EthjsMessage.md#constructor)

### Properties

- [\_codeAddress](EthjsMessage.md#_codeaddress)
- [accessWitness](EthjsMessage.md#accesswitness)
- [authcallOrigin](EthjsMessage.md#authcallorigin)
- [blobVersionedHashes](EthjsMessage.md#blobversionedhashes)
- [caller](EthjsMessage.md#caller)
- [chargeCodeAccesses](EthjsMessage.md#chargecodeaccesses)
- [code](EthjsMessage.md#code)
- [containerCode](EthjsMessage.md#containercode)
- [createdAddresses](EthjsMessage.md#createdaddresses)
- [data](EthjsMessage.md#data)
- [delegatecall](EthjsMessage.md#delegatecall)
- [depth](EthjsMessage.md#depth)
- [gasLimit](EthjsMessage.md#gaslimit)
- [gasRefund](EthjsMessage.md#gasrefund)
- [isCompiled](EthjsMessage.md#iscompiled)
- [isStatic](EthjsMessage.md#isstatic)
- [salt](EthjsMessage.md#salt)
- [selfdestruct](EthjsMessage.md#selfdestruct)
- [to](EthjsMessage.md#to)
- [value](EthjsMessage.md#value)

### Accessors

- [codeAddress](EthjsMessage.md#codeaddress)

## Constructors

### constructor

• **new EthjsMessage**(`opts`): [`EthjsMessage`](EthjsMessage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `MessageOpts` |

#### Returns

[`EthjsMessage`](EthjsMessage.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:64

## Properties

### \_codeAddress

• `Optional` **\_codeAddress**: `Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:38

___

### accessWitness

• `Optional` **accessWitness**: `AccessWitness`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:63

___

### authcallOrigin

• `Optional` **authcallOrigin**: `Address`

This is used to store the origin of the AUTHCALL,
the purpose is to figure out where `value` should be taken from (not from `caller`)

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:57

___

### blobVersionedHashes

• `Optional` **blobVersionedHashes**: `Uint8Array`[]

List of versioned hashes if message is a blob transaction in the outer VM

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:62

___

### caller

• **caller**: `Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:33

___

### chargeCodeAccesses

• `Optional` **chargeCodeAccesses**: `boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:43

___

### code

• `Optional` **code**: `Uint8Array` \| `PrecompileFunc`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:37

___

### containerCode

• `Optional` **containerCode**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:42

___

### createdAddresses

• `Optional` **createdAddresses**: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:51

___

### data

• **data**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:35

___

### delegatecall

• **delegatecall**: `boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:52

___

### depth

• **depth**: `number`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:36

___

### gasLimit

• **gasLimit**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:34

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:58

___

### isCompiled

• **isCompiled**: `boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:40

___

### isStatic

• **isStatic**: `boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:39

___

### salt

• `Optional` **salt**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:41

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`\<`string`\>

Set of addresses to selfdestruct. Key is the unprefixed address.

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:47

___

### to

• `Optional` **to**: `Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:31

___

### value

• **value**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:32

## Accessors

### codeAddress

• `get` **codeAddress**(): `Address`

Note: should only be called in instances where `_codeAddress` or `to` is defined.

#### Returns

`Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/message.d.ts:68
