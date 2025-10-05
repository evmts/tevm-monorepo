[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / FourbyteTraceResult

# Type Alias: FourbyteTraceResult

> **FourbyteTraceResult** = `object`

Defined in: packages/actions/types/common/FourbyteTraceResult.d.ts:32

Result from `debug_*` with `4byteTracer`
Returns a mapping of selector-calldata_size keys to their call counts as well as an additional mapping of contract address to selector keys to an array of calldata they were called with.

Nodes usually only return the first mapping, but Tevm returns both for better debugging.

The entries in the first mapping are in the format "0x{selector}-{calldata_size}" -> count where:
- selector: 4-byte function selector (e.g., "0x27dc297e")
- calldata_size: size of call data excluding the 4-byte selector
- count: number of times the selector-calldata_size combination was called

The entries in the second mapping are in the format "0x{contract_address}" -> "0x{selector}" -> [calldata1, calldata2, ...] where:
- contract_address: 20-byte contract address (e.g., "0x1234567890123456789012345678901234567890")
- selector: 4-byte function selector (e.g., "0x27dc297e")
- calldata: hex-encoded calldata that was called with the selector

## Index Signature

\[`K`: `string`\]: `never`

## Example

```json
{
  "0x27dc297e-32": 1,
  "0x38cc4831-0": 2,
  "0x524f3889-64": 1,
  "0x1234567890123456789012345678901234567890": {
    "0x27dc297e": ["0x0000000000000000000000000000000000000000000000000000000000000001"],
    "0x38cc4831": ["0x", "0x"],
    "0x524f3889": ["0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"]
  }
}
```
