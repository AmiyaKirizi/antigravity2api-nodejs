#!/bin/bash

echo "========================================"
echo "Antigravity2API Update Script"
echo "========================================"
echo

echo "[1/3] Stashing local changes..."
git stash push -m "Auto stash before update"
if [ $? -ne 0 ]; then
    echo "Failed to stash changes"
    exit 1
fi

echo
echo "[2/3] Pulling latest code..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "Failed to pull updates"
    exit 1
fi

echo
echo "[3/3] Installing dependencies..."
npm install

echo
echo "========================================"
echo "Update completed!"
echo "========================================"
echo
echo "To restore your local changes:"
echo "  git stash pop"
echo
echo "To discard your local changes:"
echo "  git stash drop"
echo