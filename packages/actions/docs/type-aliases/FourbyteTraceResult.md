[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FourbyteTraceResult

# Type Alias: FourbyteTraceResult

> **FourbyteTraceResult** = `object`

Defined in: [packages/actions/src/common/FourbyteTraceResult.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FourbyteTraceResult.ts#L22)

Result from `debug_*` with `4byteTracer`
Returns a mapping of selector-calldata_size keys to their call counts.

The keys are in the format "0x{selector}-{calldata_size}" where:
- selector: 4-byte function selector (e.g., "0x27dc297e")
- calldata_size: size of call data excluding the 4-byte selector

## Index Signature

\[`selectorAndSize`: `` `0x${string}-${number}` ``\]: `number`

## Example

```json
{
  "0x27dc297e-128": 1,
  "0x38cc4831-0": 2,
  "0x524f3889-96": 1,
  "0xadf59f99-288": 1,
  "0xc281d19e-0": 1
}
```
