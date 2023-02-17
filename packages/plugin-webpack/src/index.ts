import { z } from "zod";
import * as webpack from "webpack";

export const forgeOptionsValidator = z.object({
	forgeExecutable: z
		.string()
		.optional()
		.default("forge")
		.describe("path to forge executable"),
	projectRoot: z
		.string()
		.optional()
		.default(process.cwd())
		.describe("path to project root"),
	deployments: z.record(z.string()).optional().default({}),
});

export type EvmTsOptions = Partial<z.infer<typeof forgeOptionsValidator>>;

export class EvmTsPlugin {
	private options: z.infer<typeof forgeOptionsValidator>;
	constructor(options: EvmTsOptions) {
		this.options = forgeOptionsValidator.parse(options);
	}

	apply(compiler: webpack.Compiler) {
		console.log(this.options);
		compiler.hooks.normalModuleFactory.tap(
			EvmTsPlugin.name,
			(normalModuleFactory) => {
				normalModuleFactory;
			},
		);
	}
}
