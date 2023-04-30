import type typescript from "typescript/lib/tsserverlibrary";
import { createFactory } from "./factories";

const init = (modules: {
	typescript: typeof typescript;
}) => {
	return { create: createFactory(modules.typescript) };
};

export = init;
