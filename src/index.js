/**
 * Initial iteration of index file. As we test - will be updated and formatted to generate ITAM table data
 */


require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('DATAVERSE_URL from .env:', process.env.DATAVERSE_URL);

const { getToken } = require('./auth/oauth');

async function testOAuth() {
  try {
    const token = await getToken();
    console.log('OAuth token received:\n', token);
  } catch (error) {
    console.error('Failed to get token:', error.response?.data || error.message);
  }
}

testOAuth();

