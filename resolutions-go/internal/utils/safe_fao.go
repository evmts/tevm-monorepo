package utils

import (
	"github.com/williamcory/tevm/go-claude/resolutions-go/internal/common"
)

// SafeFao wraps a FileAccessObject to provide error handling
type SafeFao struct {
	Fao common.FileAccessObject
}

// NewSafeFao creates a new SafeFao
func NewSafeFao(fao common.FileAccessObject) *SafeFao {
	return &SafeFao{
		Fao: fao,
	}
}

// ReadFile safely reads a file
func (s *SafeFao) ReadFile(path string) (string, error) {
	content, err := s.Fao.ReadFile(path)
	if err != nil {
		return "", common.ReadFileError{Cause: err}
	}
	return content, nil
}

// ReadFileSync safely reads a file synchronously
func (s *SafeFao) ReadFileSync(path string) (string, error) {
	content, err := s.Fao.ReadFileSync(path)
	if err != nil {
		return "", common.ReadFileError{Cause: err}
	}
	return content, nil
}

// Exists checks if a file exists
func (s *SafeFao) Exists(path string) (bool, error) {
	exists, err := s.Fao.Exists(path)
	if err != nil {
		return false, common.ExistsError{Cause: err}
	}
	return exists, nil
}

// ExistsSync checks if a file exists synchronously
func (s *SafeFao) ExistsSync(path string) (bool, error) {
	exists, err := s.Fao.ExistsSync(path)
	if err != nil {
		return false, common.ExistsError{Cause: err}
	}
	return exists, nil
}