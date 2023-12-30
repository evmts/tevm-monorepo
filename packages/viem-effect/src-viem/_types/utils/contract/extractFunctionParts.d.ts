export declare function extractFunctionParts(def: string): {
	type: string | undefined
	name: string | undefined
	params: string | undefined
}
export declare function extractFunctionName(def: string): string | undefined
export declare function extractFunctionParams(def: string):
	| {
			indexed?: boolean | undefined
			type: string
			name: string
	  }[]
	| undefined
export declare function extractFunctionType(def: string): string | undefined
//# sourceMappingURL=extractFunctionParts.d.ts.map
