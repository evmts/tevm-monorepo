import type typescript from "typescript/lib/tsserverlibrary";
import { Logger } from "../utils";

export type Decorator = (
	createInfo: typescript.server.PluginCreateInfo,
	ts: typeof typescript,
	logger: Logger,
) => Partial<typescript.LanguageServiceHost>;
