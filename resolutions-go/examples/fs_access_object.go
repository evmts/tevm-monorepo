package examples

import (
	"os"
)

// FSAccessObject implements the FileAccessObject interface using the os package
type FSAccessObject struct{}

// ReadFile reads a file asynchronously
func (f *FSAccessObject) ReadFile(path string) (string, error) {
	data, err := os.ReadFile(path)
	return string(data), err
}

// ReadFileSync reads a file synchronously
func (f *FSAccessObject) ReadFileSync(path string) (string, error) {
	return f.ReadFile(path)
}

// Exists checks if a file exists asynchronously
func (f *FSAccessObject) Exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// ExistsSync checks if a file exists synchronously
func (f *FSAccessObject) ExistsSync(path string) (bool, error) {
	return f.Exists(path)
}