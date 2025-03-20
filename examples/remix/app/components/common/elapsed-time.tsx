import { useEffect, useState } from 'react';

/**
 * @notice Displays an elapsed time since a timestamp
 * @param timestamp - The timestamp in ms to display the elapsed time from
 * @param refreshInterval - The interval in ms to refresh the elapsed time
 * @returns A component that displays the elapsed time in a human-readable format
 */
const ElapsedTime = ({
  timestamp,
  refreshInterval = 1000,
}: {
  timestamp: number;
  refreshInterval?: number;
}) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const updateElapsedTime = () => {
      const elapsed = (Date.now() - timestamp) / 1000;

      if (elapsed < 60) {
        setElapsedTime(`${Math.floor(elapsed)}s ago`);
      } else if (elapsed < 3600) {
        setElapsedTime(`${Math.floor(elapsed / 60)}m ago`);
      } else if (elapsed < 86400) {
        setElapsedTime(`${Math.floor(elapsed / 3600)}h ago`);
      } else {
        setElapsedTime(`${Math.floor(elapsed / 86400)}d ago`);
      }
    };

    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, refreshInterval);

    return () => clearInterval(intervalId);
  }, [timestamp, refreshInterval]);

  return (
    <span className="whitespace-nowrap text-sm">{elapsedTime}</span>
  );
};

export default ElapsedTime;