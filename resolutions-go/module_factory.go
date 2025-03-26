package resolutions

import (
	"github.com/williamcory/tevm/go-claude/resolutions-go/utils"
)

// ModuleFactory creates a module from the given module information
func ModuleFactory(absolutePath, rawCode string, remappings map[string]string, libs []string, fao FileAccessObject, sync bool) (map[string]ModuleInfo, error) {
	safeFao := utils.NewSafeFao(fao)
	
	// Create a stack to process modules
	type stackItem struct {
		AbsolutePath string
		RawCode      string
	}
	
	stack := []stackItem{{AbsolutePath: absolutePath, RawCode: rawCode}}
	modules := make(map[string]ModuleInfo)

	for len(stack) > 0 {
		// Pop next item from stack
		lastIdx := len(stack) - 1
		nextItem := stack[lastIdx]
		stack = stack[:lastIdx]
		
		// Skip if already processed
		if _, exists := modules[nextItem.AbsolutePath]; exists {
			continue
		}
		
		// Resolve imports for this module
		resolvedImports, err := ResolveImports(nextItem.AbsolutePath, nextItem.RawCode, remappings, libs, sync)
		if err != nil {
			return nil, err
		}
		
		// Update import paths in the source code
		updatedCode := utils.UpdateImportPaths(nextItem.RawCode, resolvedImports)
		
		// Update pragma in the source code
		updatedCodeWithPragma, err := utils.UpdatePragma(updatedCode, "")
		if err != nil {
			// If there's no pragma, just use the code without pragma update
			updatedCodeWithPragma = updatedCode
		}
		
		// Create imported IDs list
		importedIDs := make([]string, len(resolvedImports))
		for i, resolved := range resolvedImports {
			importedIDs[i] = resolved.Absolute
		}
		
		// Add module to the map
		modules[nextItem.AbsolutePath] = ModuleInfo{
			ID:          nextItem.AbsolutePath,
			RawCode:     nextItem.RawCode,
			Code:        updatedCodeWithPragma,
			ImportedIDs: importedIDs,
		}
		
		// Process dependencies (imported modules)
		for _, resolvedImport := range resolvedImports {
			var depRawCode string
			var err error
			
			if sync {
				depRawCode, err = safeFao.ReadFileSync(resolvedImport.Absolute)
			} else {
				depRawCode, err = safeFao.ReadFile(resolvedImport.Absolute)
			}
			
			if err != nil {
				return nil, err
			}
			
			stack = append(stack, stackItem{
				AbsolutePath: resolvedImport.Absolute,
				RawCode:      depRawCode,
			})
		}
	}
	
	return modules, nil
}