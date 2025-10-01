export function TabGroup({ children }) {
	// This is just a wrapper - we'll use the code-group directive in markdown
	// but this allows us to use the same import pattern in our files
	return <>{children}</>
}

export function Tab({ label, children }) {
	// This component isn't actually used, but it's here to maintain
	// the same import pattern in our files
	return <>{children}</>
}
