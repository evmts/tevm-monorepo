#\!/bin/bash

# File to process
FILE="/Users/williamcory/tevm-monorepo/packages/memory-client/src/test/viem/call.spec.ts"

# Create a temporary file
TEMP_FILE=$(mktemp)

# Process the file
awk '
BEGIN { in_test = 0; line_count = 0; buffer = ""; }

/it\.todo\(/ || /it\(/ {
  if (in_test) {
    print buffer;
    buffer = "";
  }
  in_test = 1;
  line_count = 0;
  buffer = $0 "\n";
  next;
}

/{ timeout: / {
  if (in_test && line_count > 0 && buffer \!~ /{ timeout: .+? },/) {
    # Extract the timeout value
    match($0, /{ timeout: [0-9_]+? }/)
    timeout = substr($0, RSTART, RLENGTH)
    
    # Remove the timeout from this line and save it for insertion after the test name
    sub(/,\s*{ timeout: [0-9_]+? }/, "")
    
    # Rewrite the buffer to insert timeout after the test name
    split(buffer, parts, "\n")
    new_buffer = parts[1] "\n\t\t" timeout ",\n"
    for (i=2; i<=length(parts); i++) {
      new_buffer = new_buffer parts[i] "\n"
    }
    buffer = new_buffer $0 "\n"
    in_test = 0;
    print buffer;
    buffer = "";
    next;
  }
}

in_test {
  line_count++;
  buffer = buffer $0 "\n";
  next;
}

{ print; }

END {
  if (buffer \!= "") print buffer;
}
' "$FILE" > "$TEMP_FILE"

# Replace the original file with the processed one
cat "$TEMP_FILE" > "$FILE"
rm "$TEMP_FILE"

echo "Updated the file $FILE"
