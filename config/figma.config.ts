/**
 * Figma API Configuration
 * 
 * Store your Figma configuration settings here.
 * IMPORTANT: For production, use environment variables or secure storage instead of hardcoding tokens.
 * The token below is only used for development purposes.
 * 
 * SECURITY WARNING:
 * - DO NOT commit this file with real tokens to version control
 * - Consider adding this file to .gitignore
 * - For production, use environment variables or a secure storage solution
 */

export const figmaConfig = {
  // Your personal access token (replace with your actual token)
  // Get your token from: https://www.figma.com/developers/api#access-tokens
  personalAccessToken: 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN',
  
  // Your Figma file key (from your Figma URL)
  // URL: https://www.figma.com/design/[FILE_KEY]/Untitled
  fileKey: 'YOUR_FIGMA_FILE_KEY',
};
