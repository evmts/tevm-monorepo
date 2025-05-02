import { generateRuntimeJs } from "@tevm/runtime-rs";

// Define simplified types
interface SolcOutput {
	contracts?: Record<string, Record<string, any>>;
	sources?: Record<string, any>;
	errors?: any[];
}

type ModuleType = "ts" | "cjs" | "mjs" | "dts";

/**
 * A wrapper around the Rust generateRuntimeJs function that handles the
 * conversion of SolcOutput to JSON for the Rust implementation.
 */
export const generateRuntimeCode = (
	solcOutput: SolcOutput,
	moduleType: ModuleType,
	useScopedPackage = true,
): string => {
	try {
		// Convert SolcOutput to JSON string for Rust
		const solcOutputJson = JSON.stringify(solcOutput);

		// Call the Rust implementation
		return generateRuntimeJs(solcOutputJson, moduleType, useScopedPackage);
	} catch (error) {
		console.error("Error generating runtime code:", error);
		throw error;
	}
};

/**
 * Cached version of the code generator to avoid repeated parsing
 * of the same solc output.
 */
export const createRuntimeCodeGenerator = (useScopedPackage = true) => {
	const cache = new Map<string, string>();

	return (solcOutput: SolcOutput, moduleType: ModuleType): string => {
		// Create a cache key based on solcOutput hash and moduleType
		const cacheKey = `${JSON.stringify(solcOutput)}_${moduleType}`;

		// Check if we have a cached result
		if (cache.has(cacheKey)) {
			return cache.get(cacheKey) as string;
		}

		// Generate new code
		const result = generateRuntimeCode(
			solcOutput,
			moduleType,
			useScopedPackage,
		);

		// Cache the result
		cache.set(cacheKey, result);

		return result;
	};
};
