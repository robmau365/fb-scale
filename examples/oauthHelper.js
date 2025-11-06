/*
Minimal OAuth helper example (server-side) showing the recommended flow for
obtaining a Facebook short-lived page access token for local testing.

Notes:
- This is a simplified example for developers. For production, implement full
  OAuth code exchange on a secure backend and use a secrets manager.
- Do NOT commit tokens to the repository. Use environment variables or a
  secrets manager for storing tokens.
*/

const express = require('express');
const axios = require('axios');
const app = express();

// Replace these values with your app's values or set via env in local dev
const FB_APP_ID = process.env.FB_APP_ID || 'YOUR_FACEBOOK_APP_ID';
const FB_APP_SECRET = process.env.FB_APP_SECRET || 'YOUR_FACEBOOK_APP_SECRET';
const REDIRECT_URI = process.env.FB_OAUTH_REDIRECT || 'http://localhost:4000/oauth/callback';

// Step 1: Redirect the developer to Facebook's OAuth dialog to authorize the app
app.get('/oauth/start', (req, res) => {
  const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=pages_read_engagement,pages_read_user_content,ads_read`;
  res.redirect(authUrl);
});

// Step 2: Facebook redirects back with a code. Exchange the code for a short-lived token.
app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code from Facebook');

  try {
    const tokenResp = await axios.get('https://graph.facebook.com/v17.0/oauth/access_token', {
      params: {
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code
      }
    });

    // tokenResp.data includes access_token (short-lived) and expires_in
    const { access_token } = tokenResp.data;

    // For pages you manage, exchange user token for a page access token
    // Example: fetch pages and instruct the developer to pick the page id
    const pages = await axios.get('https://graph.facebook.com/v17.0/me/accounts', {
      params: { access_token }
    });

    res.json({ shortLivedUserToken: access_token, pages: pages.data });
  } catch (err) {
    res.status(500).json({ error: err?.response?.data || err.message });
  }
});

app.listen(4000, () => console.log('OAuth helper listening on :4000'));
