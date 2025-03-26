package utils

import (
	"regexp"

	"github.com/williamcory/tevm/go-claude/resolutions-go"
)

var solidityImportRegex = regexp.MustCompile(`(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)`)

// UpdateImportPaths updates all the import paths that match the resolvedImports
func UpdateImportPaths(code string, resolvedImports []resolutions.ResolvedImport) string {
	return solidityImportRegex.ReplaceAllStringFunc(code, func(match string) string {
		submatches := solidityImportRegex.FindStringSubmatch(match)
		if len(submatches) < 4 {
			return match
		}

		p1, p2, p3 := submatches[1], submatches[2], submatches[3]
		
		// Find the matching resolved import
		for _, resolvedImport := range resolvedImports {
			if resolvedImport.Original == p2 {
				return p1 + resolvedImport.Updated + p3
			}
		}
		
		return match
	})
}

// UpdateImportPath updates a specific import path in source code
func UpdateImportPath(source, oldPath, newPath string) string {
	return solidityImportRegex.ReplaceAllStringFunc(source, func(match string) string {
		submatches := solidityImportRegex.FindStringSubmatch(match)
		if len(submatches) < 4 {
			return match
		}

		p1, p2, p3 := submatches[1], submatches[2], submatches[3]
		
		if p2 == oldPath {
			return p1 + newPath + p3
		}
		
		return match
	})
}