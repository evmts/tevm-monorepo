[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / Eof

# Class: Eof

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/eof/container.d.ts:62

Main constructor for the EOFContainer

## Constructors

### Constructor

> **new Eof**(`buf`, `eofMode?`, `dataSectionAllowedSmaller?`): `EOFContainer`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/eof/container.d.ts:73

#### Parameters

##### buf

`Uint8Array`

Entire container buffer

##### eofMode?

`EOFContainerMode`

Container mode to validate the container on

##### dataSectionAllowedSmaller?

`boolean`

`true` if the data section is allowed to be smaller than the data section size in the header

#### Returns

`EOFContainer`

## Properties

### body

> **body**: `EOFBody`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/eof/container.d.ts:64

***

### buffer

> **buffer**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/eof/container.d.ts:65

***

### eofMode

> **eofMode**: `EOFContainerMode`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/eof/container.d.ts:66

***

### header

> **header**: `EOFHeader`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/eof/container.d.ts:63
