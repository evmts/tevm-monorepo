package utils

import (
	"strings"
)

// IsSolidity determines if a file path is a Solidity file
func IsSolidity(fileName string) bool {
	return strings.HasSuffix(fileName, ".sol") && !strings.HasSuffix(fileName, "/.sol") && fileName != ".sol"
}