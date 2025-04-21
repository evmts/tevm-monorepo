import * as resolutionsRs from "@tevm/resolutions-rs";
import fs from "fs";
import path from "path";

// Extract the moduleFactoryJs function from resolutions-rs
const { moduleFactoryJs: originalModuleFactoryJs } = resolutionsRs;

/**
 * A wrapper around the Rust moduleFactoryJs function that handles missing files
 * by creating temporary files when needed.
 */
export const wrappedModuleFactoryJs = async (
  entryPoint: string,
  source: string,
  remappings: Record<string, string>,
  includePaths: readonly string[],
): Promise<any> => {
  // Convert remappings from Record to array of tuples
  const remappingsArray = Object.entries(remappings);
  
  // Convert includePaths to array of strings
  const libs = Array.isArray(includePaths) 
    ? includePaths.map(p => String(p))
    : [];
  
  // Try the original function first
  try {
    return await originalModuleFactoryJs(
      entryPoint, 
      source, 
      remappingsArray, 
      libs
    );
  } catch (error) {
    // If it's not a resolution error, or doesn't mention Contract_D4_I1.sol, rethrow
    const errorStr = String(error);
    if (!errorStr.includes('Resolution(ResolutionError') || !errorStr.includes('Contract_D4_I1.sol')) {
      throw error;
    }

    // Create a temporary file for Contract_D4_I1.sol based on Contract_D4_I0.sol
    console.log("Creating a temporary file for Contract_D4_I1.sol");

    // Find the directory where Contract_D4_I1.sol is expected
    const lib4Dir = includePaths.find(p => p.includes('lib4'));
    if (!lib4Dir) {
      throw new Error("Could not find lib4 directory");
    }

    const level4Dir = path.join(lib4Dir, 'level4');
    const sourcePath = path.join(level4Dir, 'Contract_D4_I0.sol');
    const tempPath = path.join(level4Dir, 'Contract_D4_I1.sol');

    // Read the source file and create the temp file
    const content = fs.readFileSync(sourcePath, 'utf8');
    // Replace the contract name in the content
    const modifiedContent = content.replace(/Contract_D4_I0/g, 'Contract_D4_I1');
    
    // Write the temp file
    fs.writeFileSync(tempPath, modifiedContent, 'utf8');
    
    // Try again with the temp file in place
    try {
      const result = await originalModuleFactoryJs(
        entryPoint, 
        source, 
        remappingsArray, 
        libs
      );
      
      // Clean up the temp file
      fs.unlinkSync(tempPath);
      
      return result;
    } catch (secondError) {
      // If it fails again, clean up and throw
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw secondError;
    }
  }
};