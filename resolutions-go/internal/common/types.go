package common

// FileAccessObject provides an interface for file system operations
type FileAccessObject interface {
	// ReadFile reads a file asynchronously
	ReadFile(path string) (string, error)
	// ReadFileSync reads a file synchronously
	ReadFileSync(path string) (string, error)
	// Exists checks if a file exists asynchronously
	Exists(path string) (bool, error)
	// ExistsSync checks if a file exists synchronously
	ExistsSync(path string) (bool, error)
}

// Logger provides an interface for logging operations
type Logger interface {
	Info(messages ...string)
	Error(messages ...string)
	Warn(messages ...string)
	Log(messages ...string)
}

// ResolvedImport represents a resolved import statement
type ResolvedImport struct {
	Original string // The original import path as it appears in the source
	Absolute string // The absolute path to the imported file
	Updated  string // The updated import path (usually same as Absolute)
}

// ModuleInfo represents information about a Solidity module
type ModuleInfo struct {
	ID         string   // The ID of the module (absolute path)
	RawCode    string   // The source code of the module
	Code       string   // The code after transformations (resolving imports)
	ImportedIDs []string // The module IDs statically imported by this module
}