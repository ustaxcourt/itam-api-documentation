import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from './oauth.js';

console.log('Function queryAssets loaded');

const { DATAVERSE_URL } = process.env;

app.http('queryAssets', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const token = await getToken();
      //token invalid case
      if (!token) {
        return {
          status: 403,
          jsonBody: {
            error: 'Unauthorized',
            details: 'OAuth token is missing or invalid.'
          }
        };
      }

      const response = await axios.get(
        `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );
      //successful query - will modify so that this is per asset soon
      return {
        status: 200,
        jsonBody: response.data
      };
    } catch (error) {
      // Internal server error - checking for a default 500 and catches response msg
      const status = error.response?.status || 500;
      context.error('Dataverse query error:', error.response?.data || error.message);

      // If Dataverse returns 403, forwarded msg - different from above. This case is authentication issue at Dataverse lvl
      if (status === 403) {
        return {
          status: 403,
          jsonBody: {
            error: 'Forbidden',
            details: 'Access to Dataverse is denied. Check OAuth credentials.'
          }
        };
      }
      //this case usually will return a 401 - missing or invalid token
      return {
        status: 401,
        jsonBody: {
          error: 'Failed to query Dataverse',
          details: error.message
        }
      };
    }
  }
});
