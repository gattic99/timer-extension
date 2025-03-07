
# Publishing FocusFlow to the Chrome Web Store

This guide walks through the process of preparing and publishing FocusFlow to the Chrome Web Store.

## Prerequisites

1. A Google Developer account
2. $5 one-time registration fee for the Chrome Web Store
3. Built extension files (the `dist` directory)

## Build the Extension

1. Run the production build:
   ```
   npm run build
   ```
   
2. The `dist` directory now contains your packaged extension.

## Prepare Store Assets

1. **Icons**: Ensure you have icons in the following sizes:
   - 16x16 px
   - 48x48 px 
   - 128x128 px

2. **Screenshots**: Create at least one screenshot (1280x800 or 640x400)
   
3. **Promotional Images** (optional but recommended):
   - Small: 440x280 px
   - Large: 920x680 px
   - Marquee: 1400x560 px

4. **Description**: Prepare a detailed description (up to 132 characters for the short description)

## Submit to Chrome Web Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

2. Click "New Item" and upload a ZIP file of your `dist` directory

3. Fill in the required information:
   - Store listing details (name, description, screenshots)
   - Category (Productivity)
   - Language
   - Privacy practices (explain data usage)

4. For the Privacy section:
   - Select all data you collect
   - Add a privacy policy URL if available
   - Explain how user data is handled

5. Submit for review

## After Submission

- The review process typically takes 1-3 business days
- You'll receive an email when your extension is approved or if there are issues to fix

## Updating Your Extension

1. Increment the version number in `manifest.json`
2. Build the extension
3. Upload the new ZIP file on the developer dashboard
4. Submit for review again

## Best Practices

- Regularly update your extension
- Respond to user feedback
- Test thoroughly before each submission
- Keep your store listing updated with new features

