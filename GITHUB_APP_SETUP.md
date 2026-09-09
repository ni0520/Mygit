# GitHub App Setup Guide

## Overview

This guide will help you set up and configure the GitHub App for the Haikus Codespaces repository. The GitHub App provides automated workflows, deployment capabilities, and enhanced integration with GitHub features.

## Prerequisites

- GitHub account with admin access to the repository
- Repository: ni0520/Mygit
- Basic understanding of GitHub Apps and webhooks

## Setup Instructions

### Step 1: Create the GitHub App

1. Navigate to your GitHub account settings:
   - Go to https://github.com/settings/apps
   - Click "New GitHub App"

2. Fill in the basic information:
   - **GitHub App name**: `Haikus Codespaces App` (or choose your own unique name)
   - **Homepage URL**: `https://github.com/ni0520/Mygit`
   - **Description**: "A GitHub App for managing and deploying the Haikus for Codespaces application with automated CI/CD, code quality checks, and deployment capabilities."

3. Configure Webhook (optional):
   - **Webhook URL**: Your server endpoint (e.g., `https://your-domain.com/webhook`)
   - **Webhook secret**: Generate a secure random string
   - Note: You can disable webhooks if you don't need real-time events

4. Configure Permissions:
   Set the following repository permissions:
   - **Contents**: Read & write (for accessing repository files)
   - **Issues**: Read & write (for managing issues)
   - **Pull requests**: Read & write (for managing PRs)
   - **Workflows**: Read & write (for GitHub Actions)
   - **Checks**: Read & write (for status checks)
   - **Commit statuses**: Read & write
   - **Deployments**: Read & write
   - **Metadata**: Read only (automatically granted)
   - **Pages**: Read & write (for GitHub Pages deployment)

5. Subscribe to Events:
   Select the following events:
   - Push
   - Pull request
   - Issues
   - Issue comment
   - Workflow run
   - Deployment
   - Deployment status
   - Check run
   - Check suite
   - Release
   - Page build

6. Configure where the app can be installed:
   - Select "Only on this account" for private use
   - Or "Any account" if you want to make it available to others

7. Click "Create GitHub App"

### Step 2: Generate Private Key

1. After creating the app, scroll down to "Private keys"
2. Click "Generate a private key"
3. Save the downloaded `.pem` file securely
4. Never commit this file to your repository

### Step 3: Install the App

1. On the GitHub App settings page, click "Install App" in the left sidebar
2. Select the account where you want to install it
3. Choose "Only select repositories" and select `ni0520/Mygit`
4. Click "Install"

### Step 4: Configure Environment Variables

If you're running a webhook server, set these environment variables:

```bash
# App configuration
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY_PATH=/path/to/private-key.pem
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Application settings
PORT=3000
NODE_ENV=production
```

### Step 5: Using the Manifest (Alternative Method)

Alternatively, you can use the manifest file included in this repository:

1. Go to https://github.com/settings/apps/new
2. In the "Register a new GitHub App" page, look for the option to use a manifest
3. Upload the `github-app-manifest.json` file from this repository
4. Follow the prompts to complete the setup

## Integration with Existing Workflows

This GitHub App integrates seamlessly with the existing workflows in `.github/workflows/`:

- **node.js.yml**: Node.js CI testing
- **code-quality.yml**: ESLint and Prettier checks
- **test-and-merge.yml**: Automated testing and merging
- **release.yml**: Release management
- **dependabot.yml**: Dependency updates
- **npm-publish-github-packages.yml**: Package publishing

## Webhook Implementation (Optional)

If you want to implement webhook handling, create a webhook server that listens for events:

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();

// Webhook endpoint
app.post('/webhook', express.json(), (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  // Verify signature
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }

  // Handle different event types
  const event = req.headers['x-github-event'];

  switch(event) {
    case 'push':
      // Handle push events
      break;
    case 'pull_request':
      // Handle PR events
      break;
    case 'issues':
      // Handle issue events
      break;
    default:
      console.log(`Unhandled event: ${event}`);
  }

  res.status(200).send('OK');
});

app.listen(3001, () => {
  console.log('Webhook server running on port 3001');
});
```

## Security Best Practices

1. **Keep your private key secure**: Never commit it to version control
2. **Use environment variables**: Store all sensitive information in environment variables
3. **Verify webhook signatures**: Always verify that webhooks are from GitHub
4. **Rotate secrets regularly**: Update your webhook secret periodically
5. **Use HTTPS**: Always use HTTPS for webhook endpoints
6. **Limit permissions**: Only request the minimum permissions needed
7. **Monitor access logs**: Regularly review who has access to your app

## Troubleshooting

### App not receiving webhooks
- Check that your webhook URL is publicly accessible
- Verify the webhook secret is correct
- Check Recent Deliveries in the GitHub App settings

### Permission errors
- Ensure the app has the necessary permissions
- Reinstall the app if you've updated permissions

### Authentication issues
- Verify your private key is correct
- Check that the App ID is correct
- Ensure the app is installed on the correct repository

## Support and Resources

- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Octokit SDK](https://github.com/octokit)
- [Repository Issues](https://github.com/ni0520/Mygit/issues)

## Next Steps

After setting up the GitHub App, consider:

1. Implementing custom automation workflows
2. Setting up deployment pipelines
3. Integrating with CI/CD tools
4. Adding custom status checks
5. Creating deployment protection rules
