import React from 'react';

export function Card({ title, icon, children, className, ...props }) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${className || ''}`} {...props}>
      {title && <h3 className="text-lg font-medium mb-2">{icon && `${icon} `}{title}</h3>}
      {children}
    </div>
  );
}

export function CardGrid({ children, columns }) {
  // Default grid with responsive breakpoints
  const gridClass = columns || "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4";

  return (
    <div className={gridClass}>
      {children}
    </div>
  );
}