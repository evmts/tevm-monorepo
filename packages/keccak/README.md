# @tevm/keccak

High-performance keccak256 implementation for Tevm using WebAssembly.

## Overview

This package provides a WebAssembly-based implementation of the keccak256 hash function, which is significantly faster than pure JavaScript implementations. The implementation is powered by Zig and compiled to WebAssembly.

## Installation

```bash
npm install @tevm/keccak
```

## Usage

```typescript
import { keccak256 } from '@tevm/keccak'

// Hash a hex string
const hexHash = await keccak256('0x68656c6c6f20776f726c64') // "hello world" in hex
console.log(hexHash) // 0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad

// Hash bytes
const bytesHash = await keccak256(new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]))
console.log(bytesHash) // 0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad
```

## Performance

This keccak256 implementation is approximately 6.2x faster than the JavaScript implementation for 32-byte inputs, making it ideal for Ethereum-related operations where hashing is a frequent operation.

### Benchmark Results

| Input Size | WebAssembly | JavaScript (viem) | Performance Improvement |
|------------|-------------|-------------------|-----------------------|
| 32 bytes   | 0.0054ms    | 0.0336ms          | 6.2x faster           |
| 64 bytes   | 0.0058ms    | 0.0345ms          | 5.9x faster           |
| 128 bytes  | 0.0065ms    | 0.0363ms          | 5.6x faster           |
| 1KB        | 0.0138ms    | 0.0704ms          | 5.1x faster           |

## Bundle Size

The WebAssembly module is only ~5KB in size, making it a lightweight addition to your application:

| Component | Size |
|-----------|------|
| WebAssembly module | 5.0KB |
| JavaScript wrapper | ~4.5KB (minified) |
| Total package | ~9.5KB (minified) |

This small footprint means you can enjoy the performance benefits of WebAssembly-powered hashing without significantly increasing your bundle size.

## API

### keccak256

```typescript
function keccak256(input: string | Uint8Array): Promise<string>
```

Computes the keccak256 hash of the input and returns it as a hex string with '0x' prefix.

- `input`: Either a hex string (with or without '0x' prefix) or a byte array
- returns: A Promise that resolves to the hash as a hex string with '0x' prefix

### hexToBytes

```typescript
function hexToBytes(hex: string): Promise<Uint8Array>
```

Converts a hex string to a byte array.

- `hex`: A hex string (with or without '0x' prefix)
- returns: A Promise that resolves to a byte array

### bytesToHex

```typescript
function bytesToHex(bytes: Uint8Array): Promise<string>
```

Converts a byte array to a hex string with '0x' prefix.

- `bytes`: A byte array
- returns: A Promise that resolves to a hex string with '0x' prefix

## License

MIT