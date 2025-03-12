
#!/bin/bash
# This script packages the FocusFlow Chrome extension

# First run the build script
./build-extension.sh

# Check if build was successful
if [ ! -f "build/extension/manifest.json" ]; then
  echo "ERROR: Build failed - manifest.json not found!"
  exit 1
fi

# Create dist directory if it doesn't exist
mkdir -p dist

# Clean previous packages
rm -rf dist/focusflow-extension.zip

# Create the zip file
echo "Creating extension package..."
cd build
zip -r ../dist/focusflow-extension.zip extension

echo ""
echo "Extension packaged successfully to dist/focusflow-extension.zip"
echo ""
echo "TO INSTALL THE EXTENSION:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' toggle in the top-right corner"
echo "3. Click 'Load unpacked' and select the 'build/extension' folder"
echo "   DO NOT SELECT THE ZIP FILE - use the folder!"
