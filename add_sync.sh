#\!/bin/bash
# Add test_vm.syncMocks() after each test_vm.call_result or test_vm.create_result assignment

file="test/evm/opcodes/create_call_comprehensive_test.zig"

# Create a temporary file
tmp_file=$(mktemp)

# Process the file
awk '
/test_vm\.(call_result|create_result) = \.{/ {
    in_assignment = 1
}
in_assignment && /^[[:space:]]*};/ {
    print $0
    print "    test_vm.syncMocks();"
    in_assignment = 0
    next
}
{print}
' "$file" > "$tmp_file"

# Replace the original file
mv "$tmp_file" "$file"
