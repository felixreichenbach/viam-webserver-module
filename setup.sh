#!/bin/sh

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js is not installed. Proceeding with installation..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    nvm install node
else
    echo "Node.js is already installed. Skipping installation."
    exit 0
fi
