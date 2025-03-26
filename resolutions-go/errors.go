package resolutions

import (
	"fmt"
)

// ImportDoesNotExistError is returned when an import does not exist
type ImportDoesNotExistError struct{}

func (e ImportDoesNotExistError) Error() string {
	return "Import does not exist"
}

// CouldNotResolveImportError is returned when an import cannot be resolved
type CouldNotResolveImportError struct {
	ImportPath   string
	AbsolutePath string
	Cause        error
}

func (e CouldNotResolveImportError) Error() string {
	return fmt.Sprintf("Could not resolve import %s from %s. Please check your remappings and libraries.", e.ImportPath, e.AbsolutePath)
}

func (e CouldNotResolveImportError) Unwrap() error {
	return e.Cause
}

// NoPragmaFoundError is returned when a pragma statement is not found in a Solidity file
type NoPragmaFoundError struct {
	Message string
}

func (e NoPragmaFoundError) Error() string {
	return e.Message
}

// ReadFileError is returned when a file cannot be read
type ReadFileError struct {
	Cause error
}

func (e ReadFileError) Error() string {
	return fmt.Sprintf("Read file error: %s", e.Cause.Error())
}

func (e ReadFileError) Unwrap() error {
	return e.Cause
}

// ExistsError is returned when file existence cannot be determined
type ExistsError struct {
	Cause error
}

func (e ExistsError) Error() string {
	return fmt.Sprintf("Unable to determine existence: %s", e.Cause.Error())
}

func (e ExistsError) Unwrap() error {
	return e.Cause
}

// InvariantError is thrown if an invariant is violated
type InvariantError struct {
	Message string
}

func (e InvariantError) Error() string {
	return e.Message
}

// ResolveError is thrown when resolution fails
type ResolveError struct {
	Cause error
}

func (e ResolveError) Error() string {
	return fmt.Sprintf("Failed to resolve: %s", e.Cause.Error())
}

func (e ResolveError) Unwrap() error {
	return e.Cause
}