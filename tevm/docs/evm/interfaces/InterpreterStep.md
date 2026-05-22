[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

## Properties

| Property | Type |
| ------ | ------ |
| <a id="account"></a> `account` | `Account` |
| <a id="address"></a> `address` | `Address` |
| <a id="codeaddress"></a> `codeAddress` | `Address` |
| <a id="depth"></a> `depth` | `number` |
| <a id="eoffunctiondepth"></a> `eofFunctionDepth?` | `number` |
| <a id="eofsection"></a> `eofSection?` | `number` |
| <a id="error"></a> `error?` | `Uint8Array`\<`ArrayBufferLike`\> |
| <a id="gasleft"></a> `gasLeft` | `bigint` |
| <a id="gasrefund"></a> `gasRefund` | `bigint` |
| <a id="immediate"></a> `immediate?` | `Uint8Array`\<`ArrayBufferLike`\> |
| <a id="memory"></a> `memory` | `Uint8Array` |
| <a id="memorywordcount"></a> `memoryWordCount` | `bigint` |
| <a id="opcode"></a> `opcode` | `object` |
| `opcode.code` | `number` |
| `opcode.dynamicFee?` | `bigint` |
| `opcode.fee` | `number` |
| `opcode.isAsync` | `boolean` |
| `opcode.name` | `string` |
| <a id="pc"></a> `pc` | `number` |
| <a id="stack"></a> `stack` | `bigint`[] |
| <a id="statemanager"></a> `stateManager` | [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md) |
| <a id="storage"></a> `storage?` | \[`` `0x${string}` ``, `` `0x${string}` ``\][] |
