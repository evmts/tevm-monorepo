#\!/bin/bash

sed -i.bak -E '
/it.todo\([[:space:]]*'"'"'[^'"'"']+'"'"',[[:space:]]*async[[:space:]]*\([^)]*\)[[:space:]]*=>[[:space:]]*\{/,/\},[[:space:]]*\{[[:space:]]*timeout:/\!b
/\},[[:space:]]*\{[[:space:]]*timeout:[[:space:]]*[0-9_]+[[:space:]]*\},[[:space:]]*\)/\!b
s/(\}),([[:space:]]*\{[[:space:]]*timeout:[[:space:]]*[0-9_]+[[:space:]]*\}),([[:space:]]*\))/\2,\1\3/g
' /Users/williamcory/tevm-monorepo/packages/memory-client/src/test/viem/call.spec.ts

echo "File updated"
