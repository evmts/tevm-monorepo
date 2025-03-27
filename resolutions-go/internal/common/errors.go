package common

// ImportDoesNotExistError is returned when an import does not exist
type ImportDoesNotExistError struct{}

func (e ImportDoesNotExistError) Error() string {
	return "Import does not exist"
}

// ReadFileError is returned when a file cannot be read
type ReadFileError struct {
	Cause error
}

func (e ReadFileError) Error() string {
	return "Read file error: " + e.Cause.Error()
}

func (e ReadFileError) Unwrap() error {
	return e.Cause
}

// ExistsError is returned when file existence cannot be determined
type ExistsError struct {
	Cause error
}

func (e ExistsError) Error() string {
	return "Unable to determine existence: " + e.Cause.Error()
}

func (e ExistsError) Unwrap() error {
	return e.Cause
}

// CouldNotResolveImportError is returned when an import cannot be resolved
type CouldNotResolveImportError struct {
	ImportPath   string
	AbsolutePath string
	Cause        error
}

func (e CouldNotResolveImportError) Error() string {
	return "Could not resolve import " + e.ImportPath + " from " + e.AbsolutePath + ". Please check your remappings and libraries."
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

// InvariantError is thrown if an invariant is violated
type InvariantError struct {
	Message string
}

func (e InvariantError) Error() string {
	return e.Message
}