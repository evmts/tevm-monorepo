import React from 'react';

export function CodeBlock({ children, language, title, caption, className }) {
  return (
    <div className={`my-8 overflow-hidden rounded-lg ${className || ''}`}>
      {title && (
        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-mono">
          {title}
        </div>
      )}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto">
        <pre className="language-rust">
          <code className={`language-${language || 'rust'}`}>
            {children}
          </code>
        </pre>
      </div>
      {caption && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          {caption}
        </div>
      )}
    </div>
  );
}