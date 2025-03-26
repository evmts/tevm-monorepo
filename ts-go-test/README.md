# ts-go-test

A utility library for testing Go implementations against their TypeScript counterparts.

## Overview

This package provides tools for:

1. Running Go CLI tools and communicating with them via JSON
2. Creating consistent virtual file systems for both TypeScript and Go code
3. Comparing outputs between TypeScript and Go functions
4. Providing a unified test harness for parallel testing

## Installation

```bash
npm install ts-go-test
```

## Usage

### Basic Setup

```typescript
import { TestHarness, GoBridge } from 'ts-go-test';
import path from 'node:path';
import { someFunction } from 'your-ts-package';

// Create the bridge to the Go CLI
const bridge = new GoBridge({ 
  cliPath: path.resolve(__dirname, '../path/to/go/cli'),
  timeout: 5000 // optional, defaults to 30000ms
});

// Create the test harness
const harness = new TestHarness(bridge);

// Set up test files
await harness.setupFiles(async (vfs) => {
  // Add individual files
  await vfs.addFile('/path/to/file.txt', 'file contents');
  
  // Add real files
  await vfs.addRealFile('/real/path/to/file.txt');
  
  // Add entire directories
  await vfs.addDirectory('/path/to/dir', ['.txt', '.sol']); // optional file extensions filter
});

// Get a FileAccessObject for your TypeScript code
const fao = harness.getFileAccessObject();

// Compare implementations
const result = await harness.compareImplementations(
  'test name',
  someFunction, // your TypeScript function
  'someFunction', // the name of the Go function to call
  [arg1, arg2, fao], // arguments to pass to the TypeScript function
  (params, files) => ({
    // Transform parameters for the Go function
    arg1: params[0],
    arg2: params[1],
    files // Pass the virtual file system to Go
  })
);

console.log(`Test ${result.name}: ${result.success ? 'PASSED' : 'FAILED'}`);
if (!result.success) {
  console.error(result.details || result.error);
}
```

### Integration with Testing Frameworks

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { TestHarness, GoBridge } from 'ts-go-test';
import { yourFunction } from 'your-ts-package';
import path from 'node:path';

// Setup test harness once for all tests
const bridge = new GoBridge({ cliPath: path.resolve(__dirname, '../path/to/go/cli') });
const harness = new TestHarness(bridge);

// Setup files before tests run
beforeAll(async () => {
  await harness.setupFiles(async (vfs) => {
    await vfs.addDirectory(path.resolve(__dirname, '../fixtures'), ['.txt']);
  });
});

describe('yourFunction', () => {
  it('Go implementation should match TypeScript implementation', async () => {
    const fao = harness.getFileAccessObject();
    const testPath = '/path/to/test/file.txt';
    
    const result = await harness.compareImplementations(
      'yourFunction test',
      yourFunction,
      'yourFunction',
      [testPath, fao],
      (params, files) => ({
        path: params[0],
        files
      })
    );
    
    expect(result.success).toBe(true);
    if (!result.success) {
      console.error(result.details || result.error);
    }
  });
});
```

## API Reference

### GoBridge

Provides communication with a Go CLI.

```typescript
new GoBridge(options: {
  cliPath: string; // Path to the Go CLI executable
  timeout?: number; // Optional timeout in milliseconds (default: 30000)
})

// Methods
callFunction<TInput, TOutput>(
  functionName: string, 
  params: TInput
): Promise<TOutput>
```

### VirtualFileSystem

Manages a virtual file system for testing.

```typescript
// Methods
addFile(filePath: string, content: string): Promise<void>
addRealFile(filePath: string): Promise<void>
addDirectory(dirPath: string, extensions?: string[]): Promise<void>
getAllFiles(): Record<string, string>
createFileAccessObject(): FileAccessObject
```

### TestHarness

Provides a unified test environment.

```typescript
new TestHarness(bridge: GoBridge)

// Methods
setupFiles(setupFn: (vfs: VirtualFileSystem) => Promise<void>): Promise<void>
getFileAccessObject(): FileAccessObject
compareImplementations<T extends unknown[], R>(
  testName: string,
  tsFunction: (...args: T) => Promise<R> | R,
  goFunctionName: string,
  params: T,
  transformParams?: (params: T, files: Record<string, string>) => unknown
): Promise<TestResult>
```

## Go CLI Requirements

Your Go CLI should:

1. Accept a function name as the first argument
2. Read JSON input from stdin
3. Return JSON output to stdout
4. Return non-zero exit code on error with error message to stderr

Example Go CLI structure:

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "os"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Fprintln(os.Stderr, "Usage: cli <function>")
        os.Exit(1)
    }

    function := os.Args[1]
    inputData, err := ioutil.ReadAll(os.Stdin)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error reading input: %v\n", err)
        os.Exit(1)
    }

    switch function {
    case "yourFunction":
        handleYourFunction(inputData)
    default:
        fmt.Fprintf(os.Stderr, "Unknown function: %s\n", function)
        os.Exit(1)
    }
}

func handleYourFunction(inputData []byte) {
    // Parse input
    var params YourFunctionParams
    if err := json.Unmarshal(inputData, &params); err != nil {
        fmt.Fprintf(os.Stderr, "Error parsing input: %v\n", err)
        os.Exit(1)
    }

    // Call your function
    result, err := yourFunction(params.Path, params.Files)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error: %v\n", err)
        os.Exit(1)
    }
    
    // Return result as JSON
    outputJSON, err := json.Marshal(result)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error serializing result: %v\n", err)
        os.Exit(1)
    }
    
    fmt.Println(string(outputJSON))
}
```