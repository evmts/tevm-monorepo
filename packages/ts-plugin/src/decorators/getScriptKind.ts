import { isSolidity } from "../utils/isSolidity";
import { Decorator } from "./decorate";

export const getScriptKindDecorator: Decorator = (createInfo, ts) => ({
	getScriptKind: (fileName) => {
		if (!createInfo.languageServiceHost.getScriptKind) {
			return ts.ScriptKind.Unknown;
		}
		if (isSolidity(fileName)) {
			return ts.ScriptKind.TS;
		}
		return createInfo.languageServiceHost.getScriptKind(fileName);
	},
});
