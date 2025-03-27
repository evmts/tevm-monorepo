package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/williamcory/tevm/go-claude/resolutions-go"
	"github.com/williamcory/tevm/go-claude/resolutions-go/internal/common"
)

// BasicFileAccessObject is a simple implementation of FileAccessObject
type BasicFileAccessObject struct{}

func (fao BasicFileAccessObject) ReadFile(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func (fao BasicFileAccessObject) ReadFileSync(path string) (string, error) {
	return fao.ReadFile(path)
}

func (fao BasicFileAccessObject) Exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (fao BasicFileAccessObject) ExistsSync(path string) (bool, error) {
	return fao.Exists(path)
}

func main() {
	// Create test directories and files
	tmpDir, err := os.MkdirTemp("", "module-factory-test")
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
	myContractCode := `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import './utils/Helpers.sol';

contract MyContract {
    function helper() public pure returns (string memory) {
        return Helpers.helperFunction();
    }
}`

	helpersCode := `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Helpers {
    function helperFunction() internal pure returns (string memory) {
        return "Helper function called";
    }
}`

	ierc20Code := `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}
`

	libraryFileCode := `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Symbol1 {
    function function1() internal pure returns (string memory) {
        return "Symbol1 function";
    }
}

library Symbol2 {
    function function2() internal pure returns (string memory) {
        return "Symbol2 function";
    }
}
`

	files := map[string]string{
		filepath.Join(contractsDir, "MyContract.sol"):         myContractCode,
		filepath.Join(utilsDir, "Helpers.sol"):               helpersCode,
		filepath.Join(openZeppelinDir, "IERC20.sol"):         ierc20Code,
		filepath.Join(libraryDir, "file.sol"):                libraryFileCode,
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
import { Symbol1, Symbol2 } from "library/file.sol";

contract TestContract {
    function testERC20(address token) public view returns (uint256) {
        IERC20 erc20 = IERC20(token);
        return erc20.totalSupply();
    }
    
    function testMyContract() public pure returns (string memory) {
        MyContract mc = new MyContract();
        return mc.helper();
    }
    
    function testSymbols() public pure returns (string memory) {
        return Symbol1.function1();
    }
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
	fmt.Printf("Main test file: %s\n", absolutePath)

	// Create file access object
	var fao common.FileAccessObject = BasicFileAccessObject{}

	// Start timer
	start := time.Now()

	// Call ModuleFactory
	modules, err := resolutions.ModuleFactory(absolutePath, testCode, remappings, libs, fao, true)
	if err != nil {
		fmt.Printf("Error creating module: %v\n", err)
		os.Exit(1)
	}

	// End timer
	elapsed := time.Since(start)
	fmt.Printf("Module factory completed in %s\n", elapsed)
	fmt.Printf("Found %d modules:\n", len(modules))

	// Print the module IDs
	moduleIDs := make([]string, 0, len(modules))
	for id := range modules {
		moduleIDs = append(moduleIDs, id)
	}

	// Output module list
	fmt.Printf("Modules: %v\n", moduleIDs)

	// Output detailed info for each module
	for id, module := range modules {
		fmt.Printf("\nModule ID: %s\n", id)
		fmt.Printf("Imported IDs (%d): %v\n", len(module.ImportedIDs), module.ImportedIDs)
	}

	// Output results as JSON for one module
	mainModule := modules[absolutePath]
	
	type ModuleOutput struct {
		ID          string   `json:"id"`
		ImportedIDs []string `json:"importedIds"`
		RawCode     string   `json:"rawCode"`
		Code        string   `json:"code"`
	}
	
	output := ModuleOutput{
		ID:          mainModule.ID,
		ImportedIDs: mainModule.ImportedIDs,
		RawCode:     "[raw code truncated]",
		Code:        "[code truncated]",
	}
	
	result, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling results: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("\nMain module details:\n%s\n", string(result))
}