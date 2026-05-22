[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / Eof

# Class: Eof

Main constructor for the EOFContainer

## Constructors

### Constructor

> **new Eof**(`buf`, `eofMode?`, `dataSectionAllowedSmaller?`): `EOFContainer`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buf` | `Uint8Array` | Entire container buffer |
| `eofMode?` | `EOFContainerMode` | Container mode to validate the container on |
| `dataSectionAllowedSmaller?` | `boolean` | `true` if the data section is allowed to be smaller than the data section size in the header |

#### Returns

`EOFContainer`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="body"></a> `body` | `EOFBody` |
| <a id="buffer"></a> `buffer` | `Uint8Array` |
| <a id="eofmode"></a> `eofMode` | `EOFContainerMode` |
| <a id="header"></a> `header` | `EOFHeader` |
