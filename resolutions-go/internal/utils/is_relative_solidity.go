package utils

import (
	"strings"
)

// IsRelativeSolidity determines if a file path is a Solidity file referenced via a relative import
func IsRelativeSolidity(fileName string) bool {
	return strings.HasPrefix(fileName, "./") && IsSolidity(fileName)
}