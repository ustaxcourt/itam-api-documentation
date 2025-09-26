import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from './oauth.js';

const { DATAVERSE_URL } = process.env;
const keyList = ["crf7f_rela_sharepoint_list_id", "@odata.etag", "overriddencreatedon", "importsequencenumber", "versionnumber", "_owningbusinessunit_value", "_ownerid_value", "_owningteam_value", "timezoneruleversionnumber", "utcconversiontimezonecode", "_owninguser_value", "_crf7f_microsoftentralookup_value"];


app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const token = await getToken();
      if (!token) {
        return {
          status: 403,
          jsonBody: {
            error: 'Unauthorized',
            details: 'OAuth token is missing or invalid.'
          }
        };
      }

      const id = request.query.get('id'); // GUID


      let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'`;


      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });


      return {
        status: 200,
        jsonBody: cleanData(response.data["value"][0])
      };
    } catch (error) {
      const status = error.response?.status || 500;
      context.error('Dataverse query error:', error.response?.data || error.message);

      return {
        status,
        jsonBody: {
          error: 'Dataverse query failed',
          details: error.response?.data?.error?.message || error.message
        }
      };
    }
  }
});



function cleanData(data) {
    let cleaned = {};
    for (const key in data) {

        if (key.endsWith("by_value") || keyList.includes(key)) {
            continue;
        }
        let newKey = key.startsWith("crf7f_") ? key.slice(6) : key;
        if (newKey === "ois_asset_rela_item_orgid") {
            newKey = "assetid";
        }
        if (newKey === "_crf7f_fac_asset_ref_locationlookup_value") {
            newKey = "locationlookup_value";
        }
        if (newKey === "_crf7f_ois_asset_dat_itemlookup_value") {
            newKey = "itemlookup_value";
        }
        if (newKey === "_crf7f_ois_asset_entra_dat_usercurrentow_value") {
            newKey = "entracurrentuser";
        }
        cleaned[newKey] = data[key];
    }
    return cleaned;
}

