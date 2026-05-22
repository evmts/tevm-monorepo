[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcContractOutput

# Type Alias: SolcContractOutput

> **SolcContractOutput** = `object`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="abi"></a> `abi` | [`Abi`](../../../index/type-aliases/Abi.md) |
| <a id="devdoc"></a> `devdoc` | `any` |
| <a id="evm"></a> `evm` | [`SolcEvmOutput`](SolcEvmOutput.md) |
| <a id="ewasm"></a> `ewasm` | [`SolcEwasmOutput`](SolcEwasmOutput.md) |
| <a id="ir"></a> `ir` | `string` |
| <a id="metadata"></a> `metadata` | `string` |
| <a id="storagelayout"></a> `storageLayout` | [`SolcStorageLayout`](SolcStorageLayout.md) |
| <a id="userdoc"></a> `userdoc` | `object` |
| `userdoc.kind` | `"user"` |
| `userdoc.methods?` | `Record`\<`string`, \{ `notice`: `string`; \}\> |
| `userdoc.notice?` | `string` |
| `userdoc.version` | `number` |
