import { isSolidity } from "./isSolidity";

export const isRelativeSolidity = (fileName: string) =>
	fileName.startsWith("./") && isSolidity(fileName);
