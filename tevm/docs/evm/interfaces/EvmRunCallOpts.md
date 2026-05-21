[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EvmRunCallOpts

# Interface: EvmRunCallOpts

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

### accessWitness?

> `optional` **accessWitness?**: `BinaryTreeAccessWitnessInterface`

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes?**: `` `0x${string}` ``[]

Versioned hashes for each blob in a blob transaction

#### Inherited from

`EVMRunOpts.blobVersionedHashes`

***

### block?

> `optional` **block?**: `Block`

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

`EVMRunOpts.block`

***

### caller?

> `optional` **caller?**: `Address`

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.caller`

***

### code?

> `optional` **code?**: `Uint8Array`\<`ArrayBufferLike`\>

The EVM code to run.

#### Inherited from

`EVMRunOpts.code`

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Created addresses in current context. Used in EIP 6780

***

### data?

> `optional` **data?**: `Uint8Array`\<`ArrayBufferLike`\>

The input data.

#### Inherited from

`EVMRunOpts.data`

***

### delegatecall?

> `optional` **delegatecall?**: `boolean`

If the call is a DELEGATECALL. Defaults to false.

***

### depth?

> `optional` **depth?**: `number`

The call depth. Defaults to `0`

#### Inherited from

`EVMRunOpts.depth`

***

### gasLimit?

> `optional` **gasLimit?**: `bigint`

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

`EVMRunOpts.gasLimit`

***

### gasPrice?

> `optional` **gasPrice?**: `bigint`

The gas price for the call. Defaults to `0`

#### Inherited from

`EVMRunOpts.gasPrice`

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

Refund counter. Defaults to `0`

***

### isCompiled?

> `optional` **isCompiled?**: `boolean`

If the code location is a precompile.

***

### isStatic?

> `optional` **isStatic?**: `boolean`

If the call should be executed statically. Defaults to false.

#### Inherited from

`EVMRunOpts.isStatic`

***

### message?

> `optional` **message?**: [`EthjsMessage`](../classes/EthjsMessage.md)

Optionally pass in an already-built message.

***

### origin?

> `optional` **origin?**: `Address`

The address where the call originated from. Defaults to the zero address.

#### Inherited from

`EVMRunOpts.origin`

***

### salt?

> `optional` **salt?**: `Uint8Array`\<`ArrayBufferLike`\>

An optional salt to pass to CREATE2.

***

### selfdestruct?

> `optional` **selfdestruct?**: `Set`\<`` `0x${string}` ``\>

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

`EVMRunOpts.selfdestruct`

***

### skipBalance?

> `optional` **skipBalance?**: `boolean`

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

***

### to?

> `optional` **to?**: `Address`

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

`EVMRunOpts.to`

***

### value?

> `optional` **value?**: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

`EVMRunOpts.value`
