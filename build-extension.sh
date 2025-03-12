
#!/bin/bash
# Script to build and package the FocusFlow Chrome Extension

echo "Building FocusFlow Chrome Extension..."

# Create a build directory if it doesn't exist
mkdir -p build/extension

# Clean previous builds
rm -rf build/extension/*

# Copy manifest and other public files
echo "Copying files..."
cp -r public/* build/extension/

# Make sure the manifest.json exists
if [ ! -f "build/extension/manifest.json" ]; then
  echo "ERROR: manifest.json not found after build!"
  exit 1
else
  echo "✓ manifest.json successfully copied"
fi

# List files in the extension directory
echo ""
echo "Files in extension directory:"
ls -la build/extension/

echo ""
echo "Extension files prepared in build/extension/"
echo "You can now load this directory in Chrome's developer mode"
echo "To load in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' toggle in the top-right corner"
echo "3. Click 'Load unpacked' and select the 'build/extension' folder"

# Make the script executable
chmod +x build-extension.sh
