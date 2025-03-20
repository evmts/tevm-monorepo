'use client';

import { useEffect, useRef } from 'react';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SourceCodeViewerProps {
  sourceCode: string;
  currentLine: number;
  breakpoints: number[];
  onToggleBreakpoint: (line: number) => void;
}

/**
 * @notice Component that displays the source code with line numbers and breakpoints
 */
const SourceCodeViewer = ({
  sourceCode,
  currentLine,
  breakpoints,
  onToggleBreakpoint,
}: SourceCodeViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = sourceCode.split('\n');

  // Auto-scroll to current line
  useEffect(() => {
    if (containerRef.current && currentLine > 0) {
      const lineElement = document.getElementById(`line-${currentLine}`);
      if (lineElement) {
        const containerHeight = containerRef.current.clientHeight;
        const lineTop = lineElement.offsetTop;
        const lineHeight = lineElement.clientHeight;

        // Center the line in the viewport if possible
        containerRef.current.scrollTop =
          lineTop - containerHeight / 2 + lineHeight;
      }
    }
  }, [currentLine]);

  // Simple syntax highlighting for Solidity
  const highlightSolidity = (line: string) => {
    // This is a simplified version - a real implementation would use a proper syntax highlighter
    return line
      .replace(
        /(pragma|contract|function|address|uint|int|bool|string|bytes|mapping|struct|event|require|emit|private|public|external|internal|view|pure|payable|returns|return)/g,
        '<span style="color: #9d86e9;">$1</span>',
      )
      .replace(/(\/\/.*)/g, '<span style="color: #6c757d;">$1</span>')
      .replace(/(".*?")/g, '<span style="color: #f1fa8c;">$1</span>');
  };

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-black p-0">
      <div className="min-h-full">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isCurrentLine = lineNumber === currentLine;
          const hasBreakpoint = breakpoints.includes(lineNumber);

          return (
            <div
              id={`line-${lineNumber}`}
              key={lineNumber}
              className={cn(
                'flex items-start hover:bg-gray-900',
                isCurrentLine && 'bg-yellow-500/10',
              )}
            >
              <div
                className="flex w-10 cursor-pointer items-center justify-end pr-2 text-right text-gray-500 select-none"
                onClick={() => onToggleBreakpoint(lineNumber)}
              >
                {hasBreakpoint ? (
                  <Circle className="mr-1 h-3 w-3 fill-red-500 stroke-red-500" />
                ) : (
                  <span className="mr-1 h-3 w-3" /> // Placeholder for spacing
                )}
                {lineNumber}
              </div>
              <div
                className={cn(
                  'flex-1 overflow-x-auto py-0.5 font-mono text-sm',
                  isCurrentLine && 'font-semibold',
                )}
                dangerouslySetInnerHTML={{
                  __html: highlightSolidity(line || ' '),
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourceCodeViewer;
