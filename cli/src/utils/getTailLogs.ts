export const getTailLogs = (logString: string) => {
	return logString.split('\n').slice(-15).join('\n')
}
