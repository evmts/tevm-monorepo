package utils

import (
	"strings"
)

// IsImportLocal checks if an import path is local
func IsImportLocal(importPath string) bool {
	return strings.HasPrefix(importPath, ".")
}