import {minimatch} from 'minimatch'

/**
 * Resolves JSON files as const if they match the config
 * @param config The configuration object
 * @param jsonFilePath The path to the JSON file
 * @param fao File Access Object
 * @param languageServiceHost The language service host
 * @param ts TypeScript object
 * @returns A script snapshot or undefined
 */
export const resolveJsonAsConst = (config: any, jsonFilePath: string, fao: any, languageServiceHost: any, ts: any) => {
	for (const matcher of config.jsonAbiAsConst) {
		if (minimatch(jsonFilePath, matcher)) {
			const jsonString = fao.readFileSync(jsonFilePath, 'utf8')
			return ts.ScriptSnapshot.fromString(`export default ${jsonString} as const`)
		}
	}
	return languageServiceHost.getScriptSnapshot(jsonFilePath)
}