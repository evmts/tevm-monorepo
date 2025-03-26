package utils

import (
	"fmt"
	"regexp"

	"github.com/williamcory/tevm/go-claude/resolutions-go"
)

var pragmaPattern = regexp.MustCompile(`pragma\s+solidity\s+((\^|~|>|>=|<|<=)?\s*(\d+\.\d+\.\d+)\s*);`)
var pragmaPatternWithBounds = regexp.MustCompile(`pragma\s+solidity\s+(>=?\d+\.\d+\.\d+)\s*<\s*(\d+\.\d+\.\d+)\s*;`)

// UpdatePragma updates the pragma statement in a Solidity file to the specified version
func UpdatePragma(solidityCode string, version string) (string, error) {
	match := pragmaPattern.FindStringSubmatch(solidityCode)
	if len(match) > 3 && match[3] != "" {
		versionToUse := version
		if versionToUse == "" {
			versionToUse = match[3]
		}
		newPragma := fmt.Sprintf("pragma solidity >=%s;", versionToUse)
		return pragmaPattern.ReplaceAllString(solidityCode, newPragma), nil
	}

	match = pragmaPatternWithBounds.FindStringSubmatch(solidityCode)
	if len(match) > 1 && match[1] != "" {
		versionToUse := fmt.Sprintf(">=%s", version)
		if version == "" {
			versionToUse = match[1]
		}
		newPragma := fmt.Sprintf("pragma solidity %s;", versionToUse)
		return pragmaPatternWithBounds.ReplaceAllString(solidityCode, newPragma), nil
	}

	return "", resolutions.NoPragmaFoundError{Message: "No valid pragma statement found."}
}