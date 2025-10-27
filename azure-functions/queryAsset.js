import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from './oauth.js';

const { DATAVERSE_URL } = process.env;
//const keyList = ["crf7f_rela_sharepoint_list_id", "@odata.etag", "overriddencreatedon", "importsequencenumber", "versionnumber", "_owningbusinessunit_value", "_ownerid_value", "_owningteam_value", "timezoneruleversionnumber", "utcconversiontimezonecode", "_owninguser_value", "_crf7f_microsoftentralookup_value"];


app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: async (request, context) => {
    try {
      const id = request.params.itemid;
      const token = await getToken();
      if (!token) {
        return {
          status: 403,
          jsonBody: {
            error: 'Unauthorized',
            details: 'dev token is missing or invalid.'
          }
        };
      }

      const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
        }
      });

      const dictionary = filterDictionary(response.data["value"][0]);

      if (Object.keys(dictionary).length === 0) {
        return {
          status: 404,
          jsonBody: {
            error: 'Dataverse query failed',
            details: "Resource Not Found"
          }
        };
      }

      return {
        status: 200,
        jsonBody: dictionary
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

function filterDictionary(dict) {
  const cleaned = {};
  const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  const allowedKeys = [
    "_crf7f_ois_asset_dat_itemlookup_value@OData.Community.Display.V1.FormattedValue",
    "_crf7f_fac_asset_ref_locationlookup_value@OData.Community.Display.V1.FormattedValue",
    "crf7f_asset_item_status@OData.Community.Display.V1.FormattedValue",
    "crf7f_phone_numbers",
    "crf7f_asset_item_condition@OData.Community.Display.V1.FormattedValue",
    "crf7f_service_activation",
    "_crf7f_ois_asset_entra_dat_usercurrentow_value@OData.Community.Display.V1.FormattedValue",
    "crf7f_os_version"
  ];

  const keyMap = {

    "_crf7f_ois_asset_dat_itemlookup_value@OData.Community.Display.V1.FormattedValue": "assetName",
    "_crf7f_fac_asset_ref_locationlookup_value@OData.Community.Display.V1.FormattedValue": "location",
    "crf7f_asset_item_status@OData.Community.Display.V1.FormattedValue": "itemStatus",
    "crf7f_phone_numbers": "phone",
    "crf7f_asset_item_condition@OData.Community.Display.V1.FormattedValue": "condition",
    "crf7f_service_activation": "activation",
    "_crf7f_ois_asset_entra_dat_usercurrentow_value@OData.Community.Display.V1.FormattedValue": "user",
    "crf7f_os_version": "osVersion"
  };

  for (const key in dict) {
    const value = dict[key];

    // Skip if key is not allowed
    if (!allowedKeys.includes(key)) {
      continue;
    }

    // Skip if value contains a GUID
    if (typeof value === "string" && guidRegex.test(value)) {
      continue;
    }

    // Use pretty key name
    const prettyKey = keyMap[key] || key;
    cleaned[prettyKey] = value;
  }

  return cleaned;
}
