[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcStorageLayoutTypeBase

# Interface: SolcStorageLayoutTypeBase

The base type for all storage layout types.

## Extended by

- [`SolcStorageLayoutBytesType`](SolcStorageLayoutBytesType.md)
- [`SolcStorageLayoutDynamicArrayType`](SolcStorageLayoutDynamicArrayType.md)
- [`SolcStorageLayoutInplaceType`](SolcStorageLayoutInplaceType.md)
- [`SolcStorageLayoutMappingType`](SolcStorageLayoutMappingType.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="encoding"></a> `encoding` | `"bytes"` \| `"dynamic_array"` \| `"inplace"` \| `"mapping"` | How the data is encoded in storage - inplace: data is laid out contiguously in storage - mapping: keccak-256 hash-based method - dynamic_array: keccak-256 hash-based method - bytes: single slot or keccak-256 hash-based depending on the data size |
| <a id="label"></a> `label` | `string` | The canonical type name |
| <a id="numberofbytes"></a> `numberOfBytes` | `string` | The number of used bytes (as a decimal string) Note: if numberOfBytes > 32 this means that more than one slot is used |
