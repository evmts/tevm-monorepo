package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	
	"github.com/williamcory/tevm/go-claude/resolutions-go"
)

// VirtualFileSystem provides file access through a map of files
type VirtualFileSystem struct {
	Files map[string]string `json:"files"`
}

// ReadFile reads a file asynchronously
func (v *VirtualFileSystem) ReadFile(path string) (string, error) {
	content, ok := v.Files[path]
	if !ok {
		return "", fmt.Errorf("file not found: %s", path)
	}
	return content, nil
}

// ReadFileSync reads a file synchronously
func (v *VirtualFileSystem) ReadFileSync(path string) (string, error) {
	return v.ReadFile(path)
}

// Exists checks if a file exists asynchronously
func (v *VirtualFileSystem) Exists(path string) (bool, error) {
	_, ok := v.Files[path]
	return ok, nil
}

// ExistsSync checks if a file exists synchronously
func (v *VirtualFileSystem) ExistsSync(path string) (bool, error) {
	return v.Exists(path)
}

type ResolveImportsParams struct {
	AbsolutePath string            `json:"absolutePath"`
	Code         string            `json:"code"`
	Remappings   map[string]string `json:"remappings"`
	Libs         []string          `json:"libs"`
	Sync         bool              `json:"sync"`
	Files        map[string]string `json:"files"`
}

type ModuleFactoryParams struct {
	AbsolutePath string            `json:"absolutePath"`
	RawCode      string            `json:"rawCode"`
	Remappings   map[string]string `json:"remappings"`
	Libs         []string          `json:"libs"`
	Sync         bool              `json:"sync"`
	Files        map[string]string `json:"files"`
}

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
	case "resolveImports":
		handleResolveImports(inputData)
	case "moduleFactory":
		handleModuleFactory(inputData)
	default:
		fmt.Fprintf(os.Stderr, "Unknown function: %s\n", function)
		os.Exit(1)
	}
}

func handleResolveImports(inputData []byte) {
	var params ResolveImportsParams
	if err := json.Unmarshal(inputData, &params); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing input: %v\n", err)
		os.Exit(1)
	}
	
	result, err := resolutions.ResolveImports(
		params.AbsolutePath,
		params.Code,
		params.Remappings,
		params.Libs,
		params.Sync,
	)
	
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	
	outputJSON, err := json.Marshal(result)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error serializing result: %v\n", err)
		os.Exit(1)
	}
	
	fmt.Println(string(outputJSON))
}

func handleModuleFactory(inputData []byte) {
	var params ModuleFactoryParams
	if err := json.Unmarshal(inputData, &params); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing input: %v\n", err)
		os.Exit(1)
	}

	vfs := &VirtualFileSystem{Files: params.Files}
	
	result, err := resolutions.ModuleFactory(
		params.AbsolutePath,
		params.RawCode,
		params.Remappings,
		params.Libs,
		vfs,
		params.Sync,
	)
	
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	
	outputJSON, err := json.Marshal(result)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error serializing result: %v\n", err)
		os.Exit(1)
	}
	
	fmt.Println(string(outputJSON))
}