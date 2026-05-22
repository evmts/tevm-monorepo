[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / Message

# Interface: Message

Defined in: [packages/actions/src/common/CallEvents.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L18)

Message object representing a call to the EVM
This corresponds to the EVM's internal Message object

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="authcallorigin"></a> `authcallOrigin?` | `Address` | Origin address for AUTH calls | [packages/actions/src/common/CallEvents.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L42) |
| <a id="caller"></a> `caller` | `Address` | Address of the account that initiated this call | [packages/actions/src/common/CallEvents.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L24) |
| <a id="code"></a> `code?` | `any` | Contract code for the call - can be bytecode or a precompile function | [packages/actions/src/common/CallEvents.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L30) |
| <a id="data"></a> `data` | `Uint8Array` | Input data to the call | [packages/actions/src/common/CallEvents.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L28) |
| <a id="delegatecall"></a> `delegatecall` | `boolean` | Whether this is a DELEGATECALL | [packages/actions/src/common/CallEvents.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L38) |
| <a id="depth"></a> `depth` | `number` | Call depth | [packages/actions/src/common/CallEvents.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L32) |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | Gas limit for this call | [packages/actions/src/common/CallEvents.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L26) |
| <a id="gasrefund"></a> `gasRefund?` | `bigint` | Gas refund counter | [packages/actions/src/common/CallEvents.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L44) |
| <a id="iscompiled"></a> `isCompiled` | `boolean` | Whether this is precompiled contract code | [packages/actions/src/common/CallEvents.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L36) |
| <a id="isstatic"></a> `isStatic` | `boolean` | Whether the call is static (view) | [packages/actions/src/common/CallEvents.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L34) |
| <a id="salt"></a> `salt?` | `Uint8Array`\<`ArrayBufferLike`\> | Salt for CREATE2 calls | [packages/actions/src/common/CallEvents.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L40) |
| <a id="to"></a> `to?` | `Address` | Target address (undefined for contract creation) | [packages/actions/src/common/CallEvents.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L20) |
| <a id="value"></a> `value` | `bigint` | Value sent with the call (in wei) | [packages/actions/src/common/CallEvents.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallEvents.ts#L22) |
