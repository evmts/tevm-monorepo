[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / EvmRunCallOpts

# Interface: EvmRunCallOpts

Options for running a call (or create) operation with `EVM.runCall()`

## Extends

- `EVMRunOpts`

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="accesswitness"></a> `accessWitness?` | `BinaryTreeAccessWitnessInterface` | - | - |
| <a id="blobversionedhashes"></a> `blobVersionedHashes?` | `` `0x${string}` ``[] | Versioned hashes for each blob in a blob transaction | `EVMRunOpts.blobVersionedHashes` |
| <a id="block"></a> `block?` | `Block` | The `block` the `tx` belongs to. If omitted a default blank block will be used. | `EVMRunOpts.block` |
| <a id="caller"></a> `caller?` | `Address` | The address that ran this code (`msg.sender`). Defaults to the zero address. | `EVMRunOpts.caller` |
| <a id="code"></a> `code?` | `Uint8Array`\<`ArrayBufferLike`\> | The EVM code to run. | `EVMRunOpts.code` |
| <a id="createdaddresses"></a> `createdAddresses?` | `Set`\<`` `0x${string}` ``\> | Created addresses in current context. Used in EIP 6780 | - |
| <a id="data"></a> `data?` | `Uint8Array`\<`ArrayBufferLike`\> | The input data. | `EVMRunOpts.data` |
| <a id="delegatecall"></a> `delegatecall?` | `boolean` | If the call is a DELEGATECALL. Defaults to false. | - |
| <a id="depth"></a> `depth?` | `number` | The call depth. Defaults to `0` | `EVMRunOpts.depth` |
| <a id="gaslimit"></a> `gasLimit?` | `bigint` | The gas limit for the call. Defaults to `16777215` (`0xffffff`) | `EVMRunOpts.gasLimit` |
| <a id="gasprice"></a> `gasPrice?` | `bigint` | The gas price for the call. Defaults to `0` | `EVMRunOpts.gasPrice` |
| <a id="gasrefund"></a> `gasRefund?` | `bigint` | Refund counter. Defaults to `0` | - |
| <a id="iscompiled"></a> `isCompiled?` | `boolean` | If the code location is a precompile. | - |
| <a id="isstatic"></a> `isStatic?` | `boolean` | If the call should be executed statically. Defaults to false. | `EVMRunOpts.isStatic` |
| <a id="message"></a> `message?` | [`EthjsMessage`](../classes/EthjsMessage.md) | Optionally pass in an already-built message. | - |
| <a id="origin"></a> `origin?` | `Address` | The address where the call originated from. Defaults to the zero address. | `EVMRunOpts.origin` |
| <a id="salt"></a> `salt?` | `Uint8Array`\<`ArrayBufferLike`\> | An optional salt to pass to CREATE2. | - |
| <a id="selfdestruct"></a> `selfdestruct?` | `Set`\<`` `0x${string}` ``\> | Addresses to selfdestruct. Defaults to the empty set. | `EVMRunOpts.selfdestruct` |
| <a id="skipbalance"></a> `skipBalance?` | `boolean` | Skip balance checks if true. If caller balance is less than message value, sets balance to message value to ensure execution doesn't fail. | - |
| <a id="to"></a> `to?` | `Address` | The address of the account that is executing this code (`address(this)`). Defaults to the zero address. | `EVMRunOpts.to` |
| <a id="value"></a> `value?` | `bigint` | The value in ether that is being sent to `opts.address`. Defaults to `0` | `EVMRunOpts.value` |
