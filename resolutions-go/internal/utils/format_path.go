package utils

import (
	"strings"
)

// FormatPath formats a path to be used in the contract loader
func FormatPath(contractPath string) string {
	return strings.ReplaceAll(contractPath, "\\", "/")
}