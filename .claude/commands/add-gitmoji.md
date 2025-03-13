# Add Gitmoji Hook

This command will install gitmoji in the current worktree by:
1. Creating the hooks directory if needed
2. Setting up the prepare-commit-msg hook for gitmoji
3. Making the hook executable

The gitmoji hook allows you to select emoji for your commits using an interactive prompt.

Do you want to proceed with installing the gitmoji commit hook?

```bash
#!/usr/bin/env bash

# Get .git directory for current worktree
GIT_DIR=$(git rev-parse --git-dir)
echo "Installing gitmoji hook to $GIT_DIR/hooks..."

# Create hooks directory if it doesn't exist
mkdir -p "$GIT_DIR/hooks"

# Create the prepare-commit-msg hook file
cat > "$GIT_DIR/hooks/prepare-commit-msg" << 'EOF'
#!/usr/bin/env bash
# gitmoji as a commit hook
if npx -v >&/dev/null
then
  exec < /dev/tty
  npx -c "gitmoji --hook $1 $2"
else
  exec < /dev/tty
  gitmoji --hook $1 $2
fi
EOF

# Make sure the hook is executable
chmod +x "$GIT_DIR/hooks/prepare-commit-msg"

echo "✅ Gitmoji hook installed successfully!"
echo "You can now use gitmoji in your commits with: npx gitmoji-cli -c"
```