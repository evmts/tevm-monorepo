import type typescript from "typescript/lib/tsserverlibrary";
import { isSolidity } from "../isSolidity";
import { existsSync } from "fs";
import { Decorator } from "./decorate";

/**
 * This appears to return a .d.ts file for a .sol file
 * @see https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/index.ts#LL128C2-L141C7
 */
export const getScriptSnapshotDecorator: Decorator = (createInfo) => ({
	getScriptSnapshot: (fileName) => {
		if (isSolidity(fileName) && existsSync(fileName)) {
			console.log("TODO", fileName);
		}
		return createInfo.languageServiceHost.getScriptSnapshot(fileName);
	},
});
