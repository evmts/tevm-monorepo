# resolutions-go

This is a Go port of the JavaScript `@tevm/resolutions` package, which is responsible for resolving Solidity imports and creating a dependency graph of Solidity modules.

## Features

- Resolve Solidity import statements to absolute file paths
- Support for remappings (like Hardhat and Foundry)
- Support for library paths
- Generate a module dependency graph
- Update import paths in source code
- Update pragma statements

## Core Types

```go
// FileAccessObject provides an interface for file system operations
type FileAccessObject interface {
    ReadFile(path string) (string, error)
    ReadFileSync(path string) (string, error)
    Exists(path string) (bool, error)
    ExistsSync(path string) (bool, error)
}

// ModuleInfo represents information about a Solidity module
type ModuleInfo struct {
    ID         string   // The ID of the module (absolute path)
    RawCode    string   // The source code of the module
    Code       string   // The code after transformations (resolving imports)
    ImportedIDs []string // The module IDs statically imported by this module
}

// ResolvedImport represents a resolved import statement
type ResolvedImport struct {
    Original string // The original import path as it appears in the source
    Absolute string // The absolute path to the imported file
    Updated  string // The updated import path (usually same as Absolute)
}
```

## Main Functions

```go
// ResolveImports returns the import resolutions for the given code
func ResolveImports(absolutePath, code string, remappings map[string]string, libs []string, sync bool) ([]ResolvedImport, error)

// ModuleFactory creates a module from the given module information
func ModuleFactory(absolutePath, rawCode string, remappings map[string]string, libs []string, fao FileAccessObject, sync bool) (map[string]ModuleInfo, error)
```

## Example Usage

```go
import (
    "fmt"
    "os"
    "path/filepath"

    "github.com/williamcory/tevm/go-claude/resolutions-go"
)

// Example FileAccessObject implementation
type FSAccessObject struct{}

func (f *FSAccessObject) ReadFile(path string) (string, error) {
    data, err := os.ReadFile(path)
    return string(data), err
}

func (f *FSAccessObject) ReadFileSync(path string) (string, error) {
    return f.ReadFile(path)
}

func (f *FSAccessObject) Exists(path string) (bool, error) {
    _, err := os.Stat(path)
    if err != nil {
        if os.IsNotExist(err) {
            return false, nil
        }
        return false, err
    }
    return true, nil
}

func (f *FSAccessObject) ExistsSync(path string) (bool, error) {
    return f.Exists(path)
}

func main() {
    // Path to a Solidity file
    pathToSolidity := filepath.Join("path", "to", "Contract.sol")
    
    // Read the file
    rawCode, err := os.ReadFile(pathToSolidity)
    if err != nil {
        panic(err)
    }
    
    // Create a file access object
    fao := &FSAccessObject{}
    
    // Create remappings
    remappings := map[string]string{
        "remapping": "remapping/src",
    }
    
    // Create libs
    libs := []string{"lib/path"}
    
    // Create modules
    modules, err := resolutions.ModuleFactory(
        pathToSolidity,
        string(rawCode),
        remappings,
        libs,
        fao,
        false,
    )
    
    if err != nil {
        panic(err)
    }
    
    // Print the first module
    module := modules[pathToSolidity]
    fmt.Printf("Module ID: %s\n", module.ID)
    fmt.Printf("Imported IDs: %v\n", module.ImportedIDs)
}
```