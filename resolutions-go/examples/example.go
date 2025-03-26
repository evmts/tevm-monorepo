package examples

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/williamcory/tevm/go-claude/resolutions-go"
)

// Example shows how to use the resolutions package
func Example() {
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