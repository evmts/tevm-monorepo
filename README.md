# Go-Claude: Tevm Bundler Go Implementation

This project provides a Go implementation of the Tevm bundler packages. It is designed to be compatible with the existing JavaScript/TypeScript codebase and follows the same architecture and API.

## Structure

- `resolutions-go`: Go implementation of the `@tevm/resolutions` package
- `ts-go-test`: Testing utilities for comparing TypeScript and Go implementations
- `resolutions-test`: Test suite for the resolutions-go package

## Packages

### resolutions-go

A Go implementation of the `@tevm/resolutions` package, which provides utilities for resolving Solidity imports and creating a dependency graph.

#### Key Features

- Resolve Solidity import statements to absolute file paths
- Support for remappings (like Hardhat and Foundry)
- Support for library paths
- Generate a module dependency graph
- Update import paths in source code
- Update pragma statements

### ts-go-test

A utility library for testing Go implementations against their TypeScript counterparts.

#### Key Features

- Run Go CLI tools and communicate with them via JSON
- Create consistent virtual file systems for both TypeScript and Go code
- Compare outputs between TypeScript and Go functions
- Provide a unified test harness for parallel testing

### resolutions-test

Test suite for comparing the TypeScript and Go implementations of the resolutions package.

## Testing Strategy

We're using a JSON-RPC bridge approach to test our Go implementation against the existing JavaScript tests:

1. **Create a Go CLI**: Each Go package has a CLI that accepts JSON input and produces JSON output
2. **Virtual File System**: Both TypeScript and Go code use the same virtual file system
3. **Parallel Testing**: Run the same inputs through both implementations and compare outputs
4. **Integration with Vitest**: Seamlessly integrate with the existing test suite

## Building and Testing

### Building the Go CLI

```bash
cd resolutions-go
go build -o bin/cli cmd/cli/main.go
```

### Running the Tests

```bash
cd resolutions-test
npm install
npm test
```

## Development Workflow

1. Start by implementing the Go version of a package (e.g., `resolutions-go`)
2. Create a CLI for the Go implementation
3. Use the `ts-go-test` harness to test against the TypeScript implementation
4. Once tests pass, move on to the next package

## Planned Packages

1. ✅ resolutions-go
2. ⬜️ bundler-cache-go
3. ⬜️ compiler-go
4. ⬜️ base-bundler-go
5. ⬜️ more to come...