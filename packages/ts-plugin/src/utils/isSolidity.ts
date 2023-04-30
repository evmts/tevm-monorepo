export const isSolidity = (fileName: string) =>
	fileName.endsWith(".sol") &&
	!fileName.endsWith("/.sol") &&
	fileName !== ".sol";
