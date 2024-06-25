[**@tevm/evm**](../README.md) • **Docs**

***

[@tevm/evm](../globals.md) / EvmRunCallOpts

# Interface: EvmRunCallOpts

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

### accessWitness?

> `optional` **accessWitness**: `AccessWitness`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:115

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `Uint8Array`[]

Versioned hashes for each blob in a blob transaction

#### Inherited from

`EVMRunOpts.blobVersionedHashes`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:77

***

### block?

> `optional` **block**: `Block`

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

`EVMRunOpts.block`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:29

***

### caller?

> `optional` **caller**: `Address`

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.caller`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:41

***

### code?

> `optional` **code**: `Uint8Array`

The EVM code to run.

#### Inherited from

`EVMRunOpts.code`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:45

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`string`\>

Created addresses in current context. Used in EIP 6780

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:97

***

### data?

> `optional` **data**: `Uint8Array`

The input data.

#### Inherited from

`EVMRunOpts.data`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:49

***

### delegatecall?

> `optional` **delegatecall**: `boolean`

If the call is a DELEGATECALL. Defaults to false.

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:106

***

### depth?

> `optional` **depth**: `number`

The call depth. Defaults to `0`

#### Inherited from

`EVMRunOpts.depth`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:61

***

### gasLimit?

> `optional` **gasLimit**: `bigint`

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

`EVMRunOpts.gasLimit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:53

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

The gas price for the call. Defaults to `0`

#### Inherited from

`EVMRunOpts.gasPrice`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:33

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Refund counter. Defaults to `0`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:110

***

### isCompiled?

> `optional` **isCompiled**: `boolean`

If the code location is a precompile.

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:89

***

### isStatic?

> `optional` **isStatic**: `boolean`

If the call should be executed statically. Defaults to false.

#### Inherited from

`EVMRunOpts.isStatic`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:65

***

### message?

> `optional` **message**: [`EthjsMessage`](../classes/EthjsMessage.md)

Optionally pass in an already-built message.

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:114

***

### origin?

> `optional` **origin**: `Address`

The address where the call originated from. Defaults to the zero address.

#### Inherited from

`EVMRunOpts.origin`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:37

***

### salt?

> `optional` **salt**: `Uint8Array`

An optional salt to pass to CREATE2.

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:93

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`string`\>

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

`EVMRunOpts.selfdestruct`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:69

***

### skipBalance?

> `optional` **skipBalance**: `boolean`

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:102

***

### to?

> `optional` **to**: `Address`

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.to`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:73

***

### value?

> `optional` **value**: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

`EVMRunOpts.value`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:57
