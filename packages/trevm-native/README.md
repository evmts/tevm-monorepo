# @tevm/trevm-native

Native Node.js bindings for trevm Ethereum VM.

This is an internal package used by `@tevm/trevm` to provide Rust-based EVM functionality.

## Implementation

This package provides:

1. A Node.js native extension using N-API to expose trevm functionality
2. A JavaScript adapter to bridge between Tevm's state manager and trevm's database interface
3. Type definitions for compatibility with the rest of the Tevm ecosystem

## Building

```bash
npm run build
```

This will:
1. Build the Rust code into a native Node.js addon
2. Build the TypeScript wrapper code

## License

MIT