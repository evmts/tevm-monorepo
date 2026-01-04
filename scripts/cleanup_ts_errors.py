#!/usr/bin/env python3
"""
Script to clean up unused @ts-expect-error comments in @tevm/actions package.
"""

import subprocess
import re
from pathlib import Path

# Get the project root
PROJECT_ROOT = Path(__file__).parent.parent
ACTIONS_SRC = PROJECT_ROOT / "packages" / "actions" / "src"

def get_unused_ts_expect_error_lines():
    """Get lines with unused @ts-expect-error directives."""
    result = subprocess.run(
        ["pnpm", "nx", "run", "@tevm/actions:build:types"],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True
    )

    unused = []
    # Parse error format for TS2578 (Unused '@ts-expect-error' directive)
    pattern = r'src/([\w/\-.]+)\((\d+),(\d+)\): error TS2578:'

    output = result.stdout + result.stderr
    for line in output.split('\n'):
        match = re.match(pattern, line)
        if match:
            file_path, line_num, col = match.groups()
            unused.append({
                'file': file_path,
                'line': int(line_num),
            })

    return unused

def remove_line(file_path, line_num):
    """Remove a specific line from a file."""
    file_full_path = ACTIONS_SRC / file_path

    if not file_full_path.exists():
        print(f"Warning: File not found: {file_full_path}")
        return False

    with open(file_full_path, 'r') as f:
        lines = f.readlines()

    if line_num > len(lines):
        print(f"Warning: Line {line_num} out of range in {file_path}")
        return False

    # Remove the line
    del lines[line_num - 1]

    with open(file_full_path, 'w') as f:
        f.writelines(lines)

    return True

def main():
    print("Finding unused @ts-expect-error directives...")
    unused = get_unused_ts_expect_error_lines()
    print(f"Found {len(unused)} unused directives")

    # Group by file and sort by line number (descending) to avoid line number shifting
    files_lines = {}
    for item in unused:
        file_path = item['file']
        if file_path not in files_lines:
            files_lines[file_path] = []
        files_lines[file_path].append(item['line'])

    removed_count = 0
    for file_path, lines in files_lines.items():
        # Sort descending so removing doesn't affect later line numbers
        for line_num in sorted(lines, reverse=True):
            if remove_line(file_path, line_num):
                removed_count += 1
                print(f"Removed: {file_path}:{line_num}")

    print(f"\nRemoved {removed_count} unused @ts-expect-error comments")
    print("Running build again to verify...")

    # Run build again to see remaining errors
    result = subprocess.run(
        ["pnpm", "nx", "run", "@tevm/actions:build:types"],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True
    )

    output = result.stdout + result.stderr
    remaining = len([l for l in output.split('\n') if 'error TS' in l and 'TS2578' not in l])
    unused_remaining = len([l for l in output.split('\n') if 'TS2578' in l])
    print(f"Real errors: {remaining}")
    print(f"Unused @ts-expect-error: {unused_remaining}")

if __name__ == '__main__':
    main()
