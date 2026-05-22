[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / Message

# Interface: Message

Message object representing a call to the EVM
This corresponds to the EVM's internal Message object

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="authcallorigin"></a> `authcallOrigin?` | [`Address`](../../address/classes/Address.md) | Origin address for AUTH calls |
| <a id="caller"></a> `caller` | [`Address`](../../address/classes/Address.md) | Address of the account that initiated this call |
| <a id="code"></a> `code?` | `any` | Contract code for the call - can be bytecode or a precompile function |
| <a id="data"></a> `data` | `Uint8Array` | Input data to the call |
| <a id="delegatecall"></a> `delegatecall` | `boolean` | Whether this is a DELEGATECALL |
| <a id="depth"></a> `depth` | `number` | Call depth |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | Gas limit for this call |
| <a id="gasrefund"></a> `gasRefund?` | `bigint` | Gas refund counter |
| <a id="iscompiled"></a> `isCompiled` | `boolean` | Whether this is precompiled contract code |
| <a id="isstatic"></a> `isStatic` | `boolean` | Whether the call is static (view) |
| <a id="salt"></a> `salt?` | `Uint8Array`\<`ArrayBufferLike`\> | Salt for CREATE2 calls |
| <a id="to"></a> `to?` | [`Address`](../../address/classes/Address.md) | Target address (undefined for contract creation) |
| <a id="value"></a> `value` | `bigint` | Value sent with the call (in wei) |
