package utils

import (
	"github.com/williamcory/tevm/go-claude/resolutions-go/internal/common"
)

// Invariant asserts an invariant in a typesafe way
func Invariant(condition bool, message string) {
	if !condition {
		panic(common.InvariantError{Message: message})
	}
}