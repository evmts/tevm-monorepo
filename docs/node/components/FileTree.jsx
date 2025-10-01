export function FileTree({ children }) {
	return (
		<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
			<div className="text-sm">{children}</div>
		</div>
	)
}

FileTree.Folder = function Folder({ name, defaultOpen = false, children }) {
	return (
		<details open={defaultOpen} className="mb-2">
			<summary className="font-semibold mb-2 cursor-pointer hover:text-blue-500 flex items-center">
				<span className="mr-1">📁</span> {name}
			</summary>
			<div className="ml-4 pl-2 border-l border-gray-200 dark:border-gray-700">{children}</div>
		</details>
	)
}

FileTree.File = function File({ name }) {
	return (
		<div className="ml-2 mb-1 flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500">
			<span className="mr-1">📄</span> {name}
		</div>
	)
}
