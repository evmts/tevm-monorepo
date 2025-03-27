package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/williamcory/tevm/go-claude/resolutions-go"
)

func main() {
	// Create test directories and files
	tmpDir, err := os.MkdirTemp("", "resolutions-test")
	if err != nil {
		fmt.Printf("Error creating temp dir: %v\n", err)
		os.Exit(1)
	}
	defer os.RemoveAll(tmpDir)

	// Create directory structure
	contractsDir := filepath.Join(tmpDir, "contracts")
	utilsDir := filepath.Join(tmpDir, "contracts", "utils")
	nodeModulesDir := filepath.Join(tmpDir, "node_modules")
	openZeppelinDir := filepath.Join(nodeModulesDir, "@openzeppelin", "contracts", "token", "ERC20")
	libraryDir := filepath.Join(nodeModulesDir, "library")
	
	dirs := []string{contractsDir, utilsDir, nodeModulesDir, openZeppelinDir, libraryDir}
	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			fmt.Printf("Error creating directory %s: %v\n", dir, err)
			os.Exit(1)
		}
	}

	// Create test files
	files := map[string]string{
		filepath.Join(contractsDir, "MyContract.sol"):         "// MyContract code",
		filepath.Join(utilsDir, "Helpers.sol"):               "// Helpers code",
		filepath.Join(openZeppelinDir, "IERC20.sol"):         "// IERC20 interface",
		filepath.Join(libraryDir, "file.sol"):                "// Library file with symbols",
	}

	for path, content := range files {
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			fmt.Printf("Error writing file %s: %v\n", path, err)
			os.Exit(1)
		}
	}

	// Test code with various types of imports
	testCode := `
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyContract.sol";
import './utils/Helpers.sol';
import { Symbol1, Symbol2 } from "library/file.sol";

contract TestContract {
    // Some contract code
}
`

	absolutePath := filepath.Join(tmpDir, "contracts", "TestContract.sol")
	// Write the test file
	if err := os.WriteFile(absolutePath, []byte(testCode), 0644); err != nil {
		fmt.Printf("Error writing test file: %v\n", err)
		os.Exit(1)
	}

	// Setup remappings and libs
	remappings := map[string]string{
		"@openzeppelin/": filepath.Join(nodeModulesDir, "@openzeppelin/"),
	}
	libs := []string{nodeModulesDir}

	fmt.Printf("Test directory structure created at: %s\n", tmpDir)
	fmt.Printf("Test file: %s\n", absolutePath)

	// Call ResolveImports
	resolvedImports, err := resolutions.ResolveImports(absolutePath, testCode, remappings, libs, true)
	
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		os.Exit(1)
	}

	// Output results as JSON
	result, err := json.MarshalIndent(resolvedImports, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling results: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(string(result))
}