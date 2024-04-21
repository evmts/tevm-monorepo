**@tevm/evm** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EvmRunCallOpts

# Interface: EvmRunCallOpts

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

### accessWitness

> **accessWitness**?: `AccessWitness`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:115

***

### blobVersionedHashes

> **blobVersionedHashes**?: `Uint8Array`[]

Versioned hashes for each blob in a blob transaction

#### Inherited from

EVMRunOpts.blobVersionedHashes

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:77

***

### block

> **block**?: `Block`

The `block` the `tx` belongs to. If omitted a default blank block will be used.

#### Inherited from

EVMRunOpts.block

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:29

***

### caller

> **caller**?: `Address`

The address that ran this code (`msg.sender`). Defaults to the zero address.

#### Inherited from

EVMRunOpts.caller

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:41

***

### code

> **code**?: `Uint8Array`

The EVM code to run.

#### Inherited from

EVMRunOpts.code

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:45

***

### createdAddresses

> **createdAddresses**?: `Set`\<`string`\>

Created addresses in current context. Used in EIP 6780

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:97

***

### data

> **data**?: `Uint8Array`

The input data.

#### Inherited from

EVMRunOpts.data

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:49

***

### delegatecall

> **delegatecall**?: `boolean`

If the call is a DELEGATECALL. Defaults to false.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:106

***

### depth

> **depth**?: `number`

The call depth. Defaults to `0`

#### Inherited from

EVMRunOpts.depth

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:61

***

### gasLimit

> **gasLimit**?: `bigint`

The gas limit for the call. Defaults to `16777215` (`0xffffff`)

#### Inherited from

EVMRunOpts.gasLimit

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:53

***

### gasPrice

> **gasPrice**?: `bigint`

The gas price for the call. Defaults to `0`

#### Inherited from

EVMRunOpts.gasPrice

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:33

***

### gasRefund

> **gasRefund**?: `bigint`

Refund counter. Defaults to `0`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:110

***

### isCompiled

> **isCompiled**?: `boolean`

If the code location is a precompile.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:89

***

### isStatic

> **isStatic**?: `boolean`

If the call should be executed statically. Defaults to false.

#### Inherited from

EVMRunOpts.isStatic

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:65

***

### message

> **message**?: [`EthjsMessage`](../classes/EthjsMessage.md)

Optionally pass in an already-built message.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:114

***

### origin

> **origin**?: `Address`

The address where the call originated from. Defaults to the zero address.

#### Inherited from

EVMRunOpts.origin

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:37

***

### salt

> **salt**?: `Uint8Array`

An optional salt to pass to CREATE2.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:93

***

### selfdestruct

> **selfdestruct**?: `Set`\<`string`\>

Addresses to selfdestruct. Defaults to the empty set.

#### Inherited from

EVMRunOpts.selfdestruct

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:69

***

### skipBalance

> **skipBalance**?: `boolean`

Skip balance checks if true. If caller balance is less than message value,
sets balance to message value to ensure execution doesn't fail.

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:102

***

### to

> **to**?: `Address`

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

#### Inherited from

EVMRunOpts.to

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:73

***

### value

> **value**?: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

#### Inherited from

EVMRunOpts.value

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:57

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
