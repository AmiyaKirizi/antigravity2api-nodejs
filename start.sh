#!/bin/bash

echo "========================================"
echo "Antigravity2API Start Script"
echo "========================================"
echo

echo "[1/2] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies."
    exit 1
fi

echo
echo "[2/2] Starting service..."
npm start
