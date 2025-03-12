
#!/bin/bash
# Script to build and package the FocusFlow Chrome Extension

echo "Building FocusFlow Chrome Extension..."

# Create build directories if they don't exist
mkdir -p build/extension

# Clean previous builds
rm -rf build/extension/*

# Copy all files from public directory
echo "Copying files..."
cp -r public/* build/extension/

# Ensure content.js exists
echo "Creating content script..."
cat > build/extension/content.js << 'EOF'
// FocusFlow Content Script
console.log('FocusFlow content script initialized');
EOF

# Ensure background.js exists
echo "Creating background script..."
cat > build/extension/background.js << 'EOF'
// FocusFlow Background Script
console.log('FocusFlow background script initialized');
EOF

# Ensure styles.css exists
echo "Creating styles..."
cat > build/extension/styles.css << 'EOF'
/* FocusFlow Extension Styles */
#focusflow-container {
  z-index: 2147483647;
}
EOF

# Ensure manifest.json exists with correct content
echo "Creating manifest..."
cat > build/extension/manifest.json << 'EOF'
{
  "manifest_version": 3,
  "name": "FocusFlow",
  "version": "1.0.0",
  "description": "Stay focused and boost productivity directly in your browser.",
  "action": {
    "default_icon": {
      "16": "icon-16.png",
      "48": "icon-48.png",
      "128": "icon-128.png"
    }
  },
  "icons": {
    "16": "icon-16.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "permissions": ["storage", "scripting", "tabs"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["styles.css"]
    }
  ]
}
EOF

# Verify files exist
echo "Verifying files..."
required_files=("manifest.json" "background.js" "content.js" "styles.css" "icon-16.png" "icon-48.png" "icon-128.png")
for file in "${required_files[@]}"; do
  if [ ! -f "build/extension/$file" ]; then
    echo "ERROR: Required file $file is missing!"
    exit 1
  fi
done

echo ""
echo "✓ Build completed successfully!"
echo "Extension files prepared in build/extension/"
echo ""
echo "To load in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' toggle in the top-right corner"
echo "3. Click 'Load unpacked' and select the 'build/extension' folder"

