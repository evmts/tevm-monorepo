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

## Getting Started

### Prerequisites

- Go 1.19 or later
- Node.js 18 or later
- npm or pnpm
- Docker (optional, for containerized testing)

### Building and Testing

You can build and test the projects using the provided Makefile:

```bash
# Build the Go CLI
make build-go

# Run tests
make test

# Build and test in Docker
make test-docker

# Setup all packages
make build-all
```

Alternatively, you can run the commands manually:

```bash
# Build the Go CLI
cd resolutions-go
go build -o bin/cli cmd/cli/main.go

# Run tests
cd ../resolutions-test
npm test
```

## Development Workflow

1. Start by implementing the Go version of a package (e.g., `resolutions-go`)
2. Create a CLI for the Go implementation
3. Use the `ts-go-test` harness to test against the TypeScript implementation
4. Once tests pass, move on to the next package

## Contributing

When contributing to this project, please follow these guidelines:

1. **Match TypeScript behavior**: The Go implementation should behave exactly like the TypeScript implementation
2. **Write tests**: All functionality should be covered by tests
3. **Follow Go conventions**: Use idiomatic Go code and follow standard Go practices
4. **Document code**: Add comments and documentation to your code

## Planned Packages

1. ✅ resolutions-go
2. ⬜️ bundler-cache-go
3. ⬜️ compiler-go
4. ⬜️ base-bundler-go
5. ⬜️ more to come...