
#!/bin/bash
# Script to build and package the FocusFlow Chrome Extension

echo "Building FocusFlow Chrome Extension..."

# Create a build directory if it doesn't exist
mkdir -p build

# Clean previous builds
rm -rf build/extension
mkdir -p build/extension

# Copy public files
echo "Copying files..."
cp -r public/* build/extension/

echo "Extension files prepared in build/extension/"
echo "You can now load this directory in Chrome's developer mode"
echo "or package it for the Chrome Web Store."

echo ""
echo "To load in Chrome developer mode:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' toggle in the top-right corner"
echo "3. Click 'Load unpacked' and select the 'build/extension' folder"

echo ""
echo "To package for distribution:"
echo "1. Go to chrome://extensions/"
echo "2. Click 'Pack extension'"
echo "3. Enter the path to 'build/extension' folder"
echo "4. This will create a .crx file that can be distributed"

# Make the script executable
chmod +x build-extension.sh
