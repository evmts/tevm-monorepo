package resolutions

import "github.com/williamcory/tevm/go-claude/resolutions-go/internal/common"

// Export types from common
type FileAccessObject = common.FileAccessObject
type Logger = common.Logger
type ModuleInfo = common.ModuleInfo
type ResolvedImport = common.ResolvedImport

// Export errors
type ImportDoesNotExistError = common.ImportDoesNotExistError
type ReadFileError = common.ReadFileError
type ExistsError = common.ExistsError
type CouldNotResolveImportError = common.CouldNotResolveImportError
type NoPragmaFoundError = common.NoPragmaFoundError
type InvariantError = common.InvariantError