#!/usr/bin/env python3
"""
WASM Size Analysis Tool for Tevm EVM Implementation

This script analyzes the size of WASM builds, breaking down sections,
functions, and providing optimization insights.

Usage:
    python3 scripts/wasm-analyze.py           # Build WASM first, then analyze (default)
    python3 scripts/wasm-analyze.py --no-build # Analyze existing WASM files without building
    python3 scripts/wasm-analyze.py -n        # Same as --no-build
"""

import subprocess
import os
import sys
import re
from pathlib import Path

def get_file_size(filepath):
    """Get file size in bytes."""
    try:
        return os.path.getsize(filepath)
    except FileNotFoundError:
        return None

def run_command(cmd):
    """Run a command and return output."""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout
    except Exception as e:
        print(f"Error running command '{cmd}': {e}")
        return ""

def analyze_wasm_sections(wasm_path):
    """Analyze WASM sections using wasm-objdump."""
    output = run_command(f"wasm-objdump -h {wasm_path}")
    
    sections = {}
    total_size = 0
    debug_size = 0
    code_data_size = 0
    
    for line in output.split('\n'):
        match = re.search(r'(\S+)\s+start=.*size=0x([0-9a-f]+)', line)
        if match:
            section = match.group(1)
            size = int(match.group(2), 16)
            
            sections[section] = size
            total_size += size
            
            if section == 'Code':
                code_data_size += size
            elif section == 'Data':
                code_data_size += size
            elif section == 'Custom':
                debug_size += size
    
    return sections, total_size, code_data_size, debug_size

def analyze_functions(wasm_path):
    """Analyze functions in WASM using wasm-objdump."""
    output = run_command(f"wasm-objdump -x {wasm_path}")
    
    functions = []
    for line in output.split('\n'):
        if 'func[' in line:
            # Handle both named and unnamed functions
            if '<' in line and '>' in line:
                match = line.split('<')[1].split('>')[0]
                functions.append(match)
            else:
                # Unnamed function
                functions.append(f"func_{len(functions)}")
    
    # Group by module
    modules = {}
    for func in functions:
        if '.' in func:
            module = func.split('.')[0]
            modules[module] = modules.get(module, 0) + 1
        else:
            modules['core'] = modules.get('core', 0) + 1
    
    return functions, modules

def format_bytes(bytes_val):
    """Format bytes into human-readable format."""
    kb = bytes_val / 1024
    mb = kb / 1024
    
    if mb >= 1:
        return f"{bytes_val:,} bytes ({mb:.2f} MB)"
    else:
        return f"{bytes_val:,} bytes ({kb:.2f} KB)"

def main():
    # Check for help flag
    if len(sys.argv) > 1 and sys.argv[1] in ['--help', '-h']:
        print(__doc__)
        sys.exit(0)
    
    # Paths
    project_root = Path(__file__).parent.parent
    wasm_dir = project_root / "zig-out" / "dist"
    
    # Check if we should skip building (default is to build)
    skip_build = len(sys.argv) > 1 and sys.argv[1] in ['--no-build', '-n']
    
    # Build WASM unless --no-build is specified
    if not skip_build:
        print("=== Building WASM ===\n")
        print("Building release WASM...")
        os.chdir(project_root)
        result = subprocess.run(['zig', 'build', 'wasm'], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error building WASM: {result.stderr}")
            sys.exit(1)
        # Debug build step may not exist, so we'll skip if it fails
        if subprocess.run(['zig', 'build', '--help'], capture_output=True, text=True).stdout.find('wasm-debug') != -1:
            print("Building debug WASM...")
            result = subprocess.run(['zig', 'build', 'wasm-debug'], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"Note: Debug build not available")
        print("Build complete!\n")
    else:
        print("=== Analyzing existing WASM files (skipping build) ===\n")
    
    # Find WASM files
    wasm_files = {
        'stripped': wasm_dir / "zigevm.wasm",
        'debug': wasm_dir / "zigevm-debug.wasm"
    }
    
    print("=== WASM Size Analysis Tool ===\n")
    
    # First, create a stripped version if it doesn't exist
    if wasm_files['stripped'].exists():
        stripped_path = wasm_dir / "zigevm-stripped.wasm"
        run_command(f"cp {wasm_files['stripped']} {stripped_path}")
        run_command(f"wasm-strip {stripped_path}")
        wasm_files['stripped'] = stripped_path
    
    # Analyze each WASM file
    results = {}
    for build_type, wasm_path in wasm_files.items():
        if not wasm_path.exists():
            print(f"Warning: {build_type} build not found at {wasm_path}")
            continue
        
        size = get_file_size(wasm_path)
        sections, total, code_data, debug = analyze_wasm_sections(wasm_path)
        functions, modules = analyze_functions(wasm_path)
        
        results[build_type] = {
            'path': wasm_path,
            'size': size,
            'sections': sections,
            'total_sections': total,
            'code_data_size': code_data,
            'debug_size': debug,
            'functions': functions,
            'modules': modules
        }
    
    # Print analysis
    if len(results) > 1:
        print("## File Size Comparison\n")
        
        if 'debug' in results and 'stripped' in results:
            debug_size = results['debug']['size']
            stripped_size = results['stripped']['size']
            
            print(f"Debug build:    {format_bytes(debug_size)}")
            print(f"Stripped build: {format_bytes(stripped_size)}")
            
            if debug_size > stripped_size:
                overhead = debug_size - stripped_size
                print(f"Debug overhead: {format_bytes(overhead)} ({overhead/debug_size*100:.1f}% of debug build)")
        else:
            # Just show what we have
            for build_type, data in results.items():
                print(f"{build_type.title()} build: {format_bytes(data['size'])}")
        print()
    
    # Analyze the main build (prefer stripped)
    main_build = 'stripped' if 'stripped' in results else 'debug'
    if main_build in results:
        data = results[main_build]
        
        print(f"## Detailed Analysis of {main_build.title()} Build\n")
        
        # Section breakdown
        print("### Section Breakdown\n")
        sections = data['sections']
        
        # Sort sections by size
        sorted_sections = sorted(sections.items(), key=lambda x: x[1], reverse=True)
        
        for section, size in sorted_sections[:10]:  # Top 10 sections
            percentage = (size / data['size']) * 100 if data['size'] > 0 else 0
            print(f"{section:<20} {format_bytes(size):<30} ({percentage:5.1f}%)")
        
        print(f"\n{'Total:':<20} {format_bytes(data['total_sections'])}")
        
        # Code vs Debug breakdown
        if data['code_data_size'] > 0:
            print(f"\nCode + Data:  {format_bytes(data['code_data_size'])} ({data['code_data_size']/data['size']*100:.1f}%)")
        if data['debug_size'] > 0:
            print(f"Debug info:   {format_bytes(data['debug_size'])} ({data['debug_size']/data['size']*100:.1f}%)")
        
        # Function analysis
        print(f"\n### Function Analysis\n")
        print(f"Total functions: {len(data['functions'])}")
        
        # Top modules by function count
        print("\nTop modules by function count:")
        sorted_modules = sorted(data['modules'].items(), key=lambda x: x[1], reverse=True)
        
        for module, count in sorted_modules[:15]:
            percentage = (count / len(data['functions'])) * 100
            print(f"  {module:<30} {count:>4} functions ({percentage:5.1f}%)")
        
        # Optimization insights
        print("\n## Optimization Insights\n")
        
        if data['code_data_size'] > 100 * 1024:  # > 100KB
            print("- Code size is over 100KB. Consider:")
            print("  - Enabling link-time optimization (LTO)")
            print("  - Using ReleaseSmall optimization mode")
            print("  - Removing unused features or modules")
        
        if len(data['functions']) > 500:
            print(f"- High function count ({len(data['functions'])}). Consider:")
            print("  - Checking for duplicate generic instantiations")
            print("  - Combining similar small functions")
            print("  - Using function deduplication")
        
        # Module-specific insights
        if 'execution' in data['modules'] and data['modules']['execution'] > 200:
            print(f"- Execution module has {data['modules']['execution']} functions. Consider:")
            print("  - Using a more compact opcode dispatch mechanism")
            print("  - Combining similar opcode implementations")
        
        if 'hash_map' in data['modules'] and data['modules']['hash_map'] > 20:
            print(f"- HashMap module has {data['modules']['hash_map']} functions. Consider:")
            print("  - Using a single generic implementation")
            print("  - Switching to a more compact data structure for WASM")

    # Additional tools suggestion
    print("\n## Further Optimization Tools\n")
    print("1. wasm-opt -Oz input.wasm -o output.wasm  # Binaryen size optimization")
    print("2. twiggy top input.wasm                   # Show largest code sections")
    print("3. wasm-decompile input.wasm               # Analyze generated code")
    
    # Check if wasm-opt is available
    if run_command("which wasm-opt"):
        print("\n[wasm-opt is available - running size optimization test...]")
        if main_build in results:
            test_path = "/tmp/test-opt.wasm"
            run_command(f"wasm-opt -Oz {results[main_build]['path']} -o {test_path} 2>/dev/null")
            opt_size = get_file_size(test_path)
            if opt_size and opt_size < results[main_build]['size']:
                saved = results[main_build]['size'] - opt_size
                print(f"wasm-opt could save {format_bytes(saved)} ({saved/results[main_build]['size']*100:.1f}%)")
    
    # Check if twiggy is available for detailed analysis
    if run_command("which twiggy"):
        print("\n## Zig Code Size Attribution (via twiggy)\n")
        
        # Analyze debug build if available to get function names
        if 'debug' in results:
            print("### Largest Zig Functions by Size:\n")
            twiggy_output = run_command(f"twiggy top -n 50 {results['debug']['path']}")
            
            # Parse and display only Zig code functions (skip debug sections and data)
            count = 0
            for line in twiggy_output.split('\n'):
                if '┊' in line and count < 30:  # Show top 30 functions (note: using Unicode ┊)
                    parts = line.split('┊')
                    if len(parts) >= 3:
                        size_str = parts[0].strip()
                        percentage = parts[1].strip()
                        name = parts[2].strip()
                        
                        # Filter for actual Zig functions
                        if (name and 
                            not name.startswith('custom section') and 
                            not name.startswith('data[') and
                            not name.startswith('"') and
                            not name.startswith('...') and
                            not name.startswith('Shallow') and  # Skip header
                            '.' in name):  # Zig functions have module.function format
                            
                            # Try to parse size
                            size_bytes = 0
                            if size_str.replace(',', '').isdigit():
                                size_bytes = int(size_str.replace(',', ''))
                            
                            print(f"{name:<70} {size_bytes:>7,} bytes ({percentage:>6})")
                            count += 1
            
            # Group by module
            print("\n### Size by Module:\n")
            twiggy_output = run_command(f"twiggy top -n 200 {results['debug']['path']}")
            
            module_sizes = {}
            for line in twiggy_output.split('\n'):
                if '┊' in line:
                    parts = line.split('┊')
                    if len(parts) >= 3:
                        size_str = parts[0].strip()
                        name = parts[2].strip()
                        
                        if (name and '.' in name and 
                            not name.startswith('custom section') and 
                            not name.startswith('data[')):
                            
                            module = name.split('.')[0]
                            if size_str.replace(',', '').isdigit():
                                size = int(size_str.replace(',', ''))
                                module_sizes[module] = module_sizes.get(module, 0) + size
            
            # Sort and display modules
            sorted_modules = sorted(module_sizes.items(), key=lambda x: x[1], reverse=True)
            total_code = sum(size for _, size in sorted_modules)
            
            for module, size in sorted_modules[:15]:  # Top 15 modules
                percentage = (size / total_code * 100) if total_code > 0 else 0
                print(f"{module:<30} {size:>10,} bytes ({percentage:>5.1f}%)")
            
            if total_code > 0:
                print(f"\n{'Total Zig code:':<30} {total_code:>10,} bytes")
        
        else:
            print("Note: Debug build not available. Build with debug symbols to see function names.")
            print("Run: python3 scripts/wasm-analyze.py --build")

if __name__ == "__main__":
    main()