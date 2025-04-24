import React from 'react';

export function FileTree({ children, className }) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 
                     bg-gray-50 dark:bg-gray-800 my-6 ${className || ''}`}>
      <div className="text-sm">
        {children}
      </div>
    </div>
  );
}

FileTree.Folder = function Folder({ name, defaultOpen = false, children }) {
  return (
    <details open={defaultOpen} className="mb-2">
      <summary className="font-semibold mb-2 cursor-pointer hover:text-blue-500 
                         flex items-center select-none">
        <span className="mr-2 text-xl">📁</span> {name}
      </summary>
      <div className="ml-6 pl-3 border-l border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </details>
  );
};

FileTree.File = function File({ name, language }) {
  // Get file extension for icon selection
  const ext = name.split('.').pop().toLowerCase();
  
  let icon = '📄';
  if (['rs', 'rust'].includes(ext)) icon = '🦀';
  if (['js', 'ts', 'jsx', 'tsx'].includes(ext)) icon = '📘';
  if (['sol'].includes(ext)) icon = '📝';
  if (['json'].includes(ext)) icon = '🔠';
  if (['md', 'mdx'].includes(ext)) icon = '📚';
  if (['toml', 'yaml', 'yml'].includes(ext)) icon = '⚙️';
  
  return (
    <div className="ml-2 mb-2 flex items-center text-gray-600 dark:text-gray-300 
                    hover:text-blue-500 cursor-pointer">
      <span className="mr-2 text-lg">{icon}</span> 
      <code className="text-sm font-mono">{name}</code>
      {language && <span className="ml-2 text-xs text-gray-400">({language})</span>}
    </div>
  );
};