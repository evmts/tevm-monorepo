package resolutions

import (
	"errors"
	"fmt"
	"path/filepath"
	"regexp"

	"github.com/williamcory/tevm/go-claude/resolutions-go/internal/common"
	"github.com/williamcory/tevm/go-claude/resolutions-go/internal/utils"
)

// ResolveImports returns the import resolutions for the given code
func ResolveImports(absolutePath, code string, remappings map[string]string, libs []string, sync bool) ([]common.ResolvedImport, error) {
	// Regular expression to match import statements in Solidity
	// The (?m) flag enables multiline mode
	// This pattern handles various import formats including:
	// - import "./Contract.sol";
	// - import "../path/Contract.sol";
	// - import { Symbol1, Symbol2 } from "./Contract.sol";
	importRegEx := regexp.MustCompile(`(?m)^\s*import\s+(?:(?:\{[^}]*\}\s+from\s+)|[^'"]*)['"](.*)['"]\s*;?`)

	// Validate inputs
	if absolutePath == "" {
		return nil, errors.New("absolutePath must be a non-empty string")
	}
	if code == "" {
		return nil, errors.New("code must be a non-empty string")
	}

	fmt.Printf("Debug: Processing file at %s\n", absolutePath)
	fmt.Printf("Debug: Code has length %d\n", len(code))
	fmt.Printf("Debug: Code snippet: %.100s...\n", code)

	// Find all imports in the code
	var resolvedImports []common.ResolvedImport
	matches := importRegEx.FindAllStringSubmatch(code, -1)

	fmt.Printf("Debug: Found %d import matches\n", len(matches))
	// Output full regex pattern for debugging
	fmt.Printf("Debug: Using regex pattern: %s\n", importRegEx.String())

	for i, match := range matches {
		fmt.Printf("Debug: Processing match %d: %v\n", i, match)
		
		if len(match) < 2 || match[1] == "" {
			fmt.Printf("Debug: Invalid match, returning error\n")
			return nil, common.ImportDoesNotExistError{}
		}

		importPath := match[1]
		fmt.Printf("Debug: Import path: %s\n", importPath)
		
		// Check remappings first
		resolvedPath := ""
		var err error
		
		// Handle remappings
		remappingResolved := false
		for key, value := range remappings {
			if len(importPath) >= len(key) && importPath[:len(key)] == key {
				// Get the relative part of the import after the key
				relativeImportPath := importPath[len(key):]
				// Join it with the remapping value to get the final path
				resolved := filepath.Join(value, relativeImportPath)
				
				resolvedPath, err = filepath.Abs(resolved)
				if err != nil {
					fmt.Printf("Debug: Error resolving remapping: %v\n", err)
					return nil, common.CouldNotResolveImportError{
						ImportPath:   importPath,
						AbsolutePath: absolutePath,
						Cause:        err,
					}
				}
				
				// Check if the file exists
				exists, _ := utils.FileExists(resolvedPath)
				if exists {
					remappingResolved = true
					fmt.Printf("Debug: Resolved via remapping to: %s\n", resolvedPath)
					break
				} else {
					fmt.Printf("Debug: Remapping resolved to %s but file does not exist\n", resolvedPath)
					resolvedPath = ""
				}
			}
		}
		
		// Handle local imports if not resolved by remapping
		if !remappingResolved && utils.IsImportLocal(importPath) {
			dir := filepath.Dir(absolutePath)
			resolved := filepath.Join(dir, importPath)
			resolvedPath, err = filepath.Abs(resolved)
			if err != nil {
				fmt.Printf("Debug: Error resolving local import: %v\n", err)
				return nil, common.CouldNotResolveImportError{
					ImportPath:   importPath,
					AbsolutePath: absolutePath,
					Cause:        err,
				}
			}
			
			// Check if the file exists
			exists, _ := utils.FileExists(resolvedPath)
			if !exists {
				fmt.Printf("Debug: Local import resolved to %s but file does not exist\n", resolvedPath)
				resolvedPath = ""
			} else {
				fmt.Printf("Debug: Resolved via local import to: %s\n", resolvedPath)
			}
		}
		
		// If not resolved yet, try node-like resolution with library paths
		if resolvedPath == "" {
			// Try to find it in library paths
			for _, lib := range libs {
				tryPath := filepath.Join(lib, importPath)
				exists, err := utils.FileExists(tryPath)
				if err == nil && exists {
					resolvedPath, err = filepath.Abs(tryPath)
					if err == nil {
						fmt.Printf("Debug: Resolved via library path to: %s\n", resolvedPath)
						break
					}
				}
			}
			
			// If still not resolved, check if it might be a node_modules path
			if resolvedPath == "" && !utils.IsImportLocal(importPath) {
				baseDir := filepath.Dir(absolutePath)
				nodeModulesPath := filepath.Join(baseDir, "node_modules", importPath)
				exists, err := utils.FileExists(nodeModulesPath)
				if err == nil && exists {
					resolvedPath, err = filepath.Abs(nodeModulesPath)
					if err == nil {
						fmt.Printf("Debug: Resolved via node_modules to: %s\n", resolvedPath)
					}
				}
			}
			
			// If still not resolved, we failed to find the import
			if resolvedPath == "" {
				fmt.Printf("Debug: Could not resolve import\n")
				return nil, common.CouldNotResolveImportError{
					ImportPath:   importPath,
					AbsolutePath: absolutePath,
					Cause:        errors.New("import not found in any of the search paths"),
				}
			}
		}
		
		resolvedPath = utils.FormatPath(resolvedPath)
		fmt.Printf("Debug: Formatted path: %s\n", resolvedPath)
		
		resolvedImports = append(resolvedImports, common.ResolvedImport{
			Original: importPath,
			Absolute: resolvedPath,
			Updated:  resolvedPath,
		})
	}

	fmt.Printf("Debug: Returning %d resolved imports\n", len(resolvedImports))
	return resolvedImports, nil
}