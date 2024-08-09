export const getTailLogs = (logString) => {
    return logString.split('\n').slice(-15).join('\n');
};
