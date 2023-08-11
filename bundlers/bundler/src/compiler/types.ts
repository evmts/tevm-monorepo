export interface SolidityCompiler {
	version: () => string
	compile: (input: any) => any
	loadRemoteVersion: (version: string) => string
	setupMethods: (soljson: any) => void
	semver: (version: string) => string
	license: () => string
	lowlevel: {
		compileSingle: null
		compileMulti: null
		compileCallback: null
		compileStandard: (input: any) => any
	}
	features: {
		legacySingleInput: boolean
		multipleInputs: boolean
		importCallback: boolean
		nativeStandardJSON: boolean
	}
}
