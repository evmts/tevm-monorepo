# Opcodes Module

This directory contains a modular packaging system for the EVM opcodes implementation. It serves as a layer of abstraction that enables specific access to components needed for opcode implementations without requiring direct imports from parent directories.

## Purpose

The module system provides several benefits:

1. **Simplified Imports**: Offers a clean way to import EVM components in opcode implementations
2. **Encapsulation**: Hides implementation details of core components
3. **Dependency Management**: Centralizes imports to avoid circular dependencies
4. **Testing Support**: Facilitates mocking and testing of opcode implementations

## Structure

The module system exports the following components:

### Core EVM Components

- **Contract**: Contract execution context and code handling
- **Frame**: Execution frame with stack and memory management
- **Interpreter**: Core bytecode interpretation engine
- **EVM**: Main Ethereum Virtual Machine implementation
- **Memory**: Linear memory implementation for EVM execution
- **Stack**: Fixed-size stack for EVM operations
- **Address**: Ethereum address utilities
- **JumpTable**: Opcode dispatch table

### Opcode Utilities

- **opcodes**: Common opcode definitions and utilities
- **test_utils**: Utilities for testing opcode implementations

## Usage

Opcode implementations can import this module to access the required components:

```zig
const module = @import("module/package.zig");
const Frame = module.Frame.Frame;
const Stack = module.Stack.Stack;
const Memory = module.Memory.Memory;
const Contract = module.Contract.Contract;
```

This approach prevents circular dependencies and provides a clean interface for opcode implementations.

## Design Considerations

- The module uses namespaced exports to prevent naming conflicts
- Each component is imported from its original location in the parent directories
- The system is designed to minimize the public API surface while providing all necessary functionality for opcode implementations

## Relationship to Parent Components

This module does not implement its own versions of components; it simply re-exports existing components from the parent directories. This ensures consistency across the codebase while providing a clean import interface.