
require('dotenv').config();
const axios = require('axios');

/**
 * Get OAuth token from Azure AD for Dataverse access
 * @returns {Promise<string>} - Access token
 */
async function getToken() {
  const { CLIENT_ID, TENANT_ID, CLIENT_SECRET, DATAVERSE_URL } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');
  params.append('scope', `${DATAVERSE_URL}/.default`);

  try {
    const response = await axios.post(tokenUrl, params);
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting OAuth token:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getToken };
