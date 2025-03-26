package resolutions

import (
	"errors"
	"regexp"

	"github.com/williamcory/tevm/go-claude/resolutions-go/utils"
)

// ResolveImports returns the import resolutions for the given code
func ResolveImports(absolutePath, code string, remappings map[string]string, libs []string, sync bool) ([]ResolvedImport, error) {
	// Regular expression to match import statements in Solidity
	importRegEx := regexp.MustCompile(`^\s?import\s+[^'"]*['"](.*)['"]\s*`)

	// Validate inputs
	if absolutePath == "" {
		return nil, errors.New("absolutePath must be a non-empty string")
	}
	if code == "" {
		return nil, errors.New("code must be a non-empty string")
	}

	// Find all imports in the code
	var resolvedImports []ResolvedImport
	matches := importRegEx.FindAllStringSubmatch(code, -1)

	for _, match := range matches {
		if len(match) < 2 || match[1] == "" {
			return nil, ImportDoesNotExistError{}
		}

		importPath := match[1]
		absolute, err := utils.ResolveImportPath(absolutePath, importPath, remappings, libs, sync)
		if err != nil {
			return nil, err
		}

		resolvedImports = append(resolvedImports, ResolvedImport{
			Original: importPath,
			Absolute: absolute,
			Updated:  absolute,
		})
	}

	return resolvedImports, nil
}