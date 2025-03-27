package utils

import (
	"os"
)

// FileExists checks if a file exists and is not a directory
func FileExists(filename string) (bool, error) {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return !info.IsDir(), nil
}

// DirectoryExists checks if a directory exists
func DirectoryExists(dirPath string) (bool, error) {
	info, err := os.Stat(dirPath)
	if os.IsNotExist(err) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return info.IsDir(), nil
}