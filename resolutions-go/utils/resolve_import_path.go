package utils

import (
	"errors"
	"os"
	"path"
	"path/filepath"

	"github.com/williamcory/tevm/go-claude/resolutions-go"
)

// ResolveImportPath resolves an import statement to an absolute file path
func ResolveImportPath(absolutePath, importPath string, remappings map[string]string, libs []string, sync bool) (string, error) {
	// Check remappings first
	for key, value := range remappings {
		if len(importPath) >= len(key) && importPath[:len(key)] == key {
			resolved := path.Join(importPath[len(key):], value)
			return FormatPath(filepath.Abs(resolved))
		}
	}

	// Local import "./LocalContract.sol"
	if IsImportLocal(importPath) {
		dir := filepath.Dir(absolutePath)
		resolved := filepath.Join(dir, importPath)
		absPath, err := filepath.Abs(resolved)
		if err != nil {
			return "", resolutions.CouldNotResolveImportError{
				ImportPath:   importPath,
				AbsolutePath: absolutePath,
				Cause:        err,
			}
		}
		return FormatPath(absPath), nil
	}

	// Try node-like resolution
	// First check in the same directory
	dir := filepath.Dir(absolutePath)
	candidatePath := filepath.Join(dir, importPath)
	if _, err := os.Stat(candidatePath); err == nil {
		absPath, err := filepath.Abs(candidatePath)
		if err != nil {
			return "", resolutions.CouldNotResolveImportError{
				ImportPath:   importPath,
				AbsolutePath: absolutePath,
				Cause:        err,
			}
		}
		return FormatPath(absPath), nil
	}

	// Try in lib paths
	for _, lib := range libs {
		candidatePath := filepath.Join(lib, importPath)
		if _, err := os.Stat(candidatePath); err == nil {
			absPath, err := filepath.Abs(candidatePath)
			if err != nil {
				return "", resolutions.CouldNotResolveImportError{
					ImportPath:   importPath,
					AbsolutePath: absolutePath,
					Cause:        err,
				}
			}
			return FormatPath(absPath), nil
		}
	}

	// If we get here, we couldn't resolve the import
	return "", resolutions.CouldNotResolveImportError{
		ImportPath:   importPath,
		AbsolutePath: absolutePath,
		Cause:        errors.New("import not found in any of the search paths"),
	}
}