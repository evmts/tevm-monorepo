/**
 * @notice Utility to simulate loading and error states during development
 * @dev To use, append the following query parameters to the URL:
 *  loading state append ?loading or ?loading=10000 (duration in ms)
 *  error state append ?error or ?error="Custom error message."
 *  loading and error state append ?loading&error
 * @param searchParams - The search parameters from the URL
 * @see https://sometechblog.com/posts/how-to-easily-test-next-js-loading-and-error-states/
 */
export const layoutTester = async (searchParams: Record<string, string>) => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (typeof searchParams.loading !== 'undefined') {
    const loading = parseInt(searchParams.loading || '2000', 10);
    await new Promise((resolve) => setTimeout(resolve, loading));
  }

  if (typeof searchParams.error !== 'undefined') {
    const error = searchParams.error || 'Something went wrong!';
    await new Promise((_resolve, reject) => reject(error));
  }
};
