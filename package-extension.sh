
#!/bin/bash
# This script packages the FocusFlow Chrome extension

# Create dist directory if it doesn't exist
mkdir -p dist

# Clean previous builds
rm -rf dist/focusflow-extension
mkdir -p dist/focusflow-extension

# Copy necessary files
cp -r public/* dist/focusflow-extension/
cp EXTENSION_README.md dist/focusflow-extension/README.md
cp LICENSE dist/focusflow-extension/ 2>/dev/null || echo "No LICENSE file found"

# Create the zip file
cd dist
zip -r focusflow-extension.zip focusflow-extension

echo "Extension packaged successfully to dist/focusflow-extension.zip"
echo "You can now upload this file to the Chrome Web Store or install it in developer mode."
