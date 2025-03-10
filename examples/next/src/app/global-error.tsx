'use client';

import { Button } from '@/components/ui/button';

import '@/styles/globals.css';

/**
 * @notice A fallback component to handle global errors
 * @param error - The error that was thrown
 * @param reset - A function to reset the application
 * @returns The error message and a button to reset the application
 */
const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Something went wrong</h2>
          <p className="text-secondary-foreground">
            An error occurred while rendering the application.
          </p>
          <p className="text-secondary-foreground text-xs">
            {error.digest
              ? `Error digest: ${error.digest}`
              : `Error message: ${error.message}`}
          </p>
          <Button type="reset" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
