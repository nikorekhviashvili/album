#!/bin/bash
# Prepares a Claude Code cloud session: installs the Playwright test runner so
# the smoke suite can run. Does nothing on a local machine. The site itself
# has no dependencies; package.json only exists for the tests.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Reinstall only when package-lock.json has changed since the last install.
stamp="node_modules/.package-lock.sha"
current="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ ! -f "$stamp" ] || [ "$(cat "$stamp")" != "$current" ]; then
  npm ci --no-audit --no-fund
  echo "$current" > "$stamp"
fi
