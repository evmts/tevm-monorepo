'use client';

interface LogEntry {
  pc: number;
  message: string;
  timestamp: string;
  type: string;
}

interface LogsPanelProps {
  logs: LogEntry[];
}

/**
 * @notice Component to display execution logs
 */
const LogsPanel = ({ logs }: LogsPanelProps) => {
  return (
    <div className="h-full p-2 overflow-auto bg-black">
      <div className="text-xs text-muted-foreground mb-2">Console Output</div>

      {logs.length === 0 ? (
        <div className="text-xs text-muted-foreground p-2 italic">No logs to display</div>
      ) : (
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`text-xs font-mono border-l-2 pl-2 py-1 ${
                log.type === 'error'
                  ? 'border-red-500 text-red-400'
                  : log.type === 'warning'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                <span>PC: {log.pc}</span>
                <span>{log.timestamp}</span>
              </div>
              <div>{log.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogsPanel;