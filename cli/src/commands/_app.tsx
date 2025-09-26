import type { AppProps } from 'pastel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

export default function App({ Component, commandProps }: AppProps) {
	const C = Component as any;
	return (
		<QueryClientProvider client={queryClient}>
			<C {...commandProps} />
		</QueryClientProvider>
	);
}
