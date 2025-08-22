/**
 * Very very early iteration of this file. Have yet to make major modifications and still configuring
 * which files and packages need to be installed and added. 
 * 
 * dotenv is a standard package that handles environment variables.
 * Aim is to use this tool / package (as we need Node.js to use it) to do our variable handling
 * 
 * Note from Microsoft on OData version: 
 * The OData version 4.01 is the latest version. It includes enhancements and more features not available in version 4.0, and therefore not currently available in the Dataverse Web API.
 * Source: https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query/overview
 * 
 * Note from Microsoft on API version: (v9.x versions being the most recent - debating between v9.1 and v9.2)
 * While the v9.x releases can support specific differences, there have been no breaking changes added to v9.0, v9.1, or v9.2 releases. 
 * Each of these releases are have identical Web API behaviors.
 * Source: https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/web-api-versions 
 * 
 * These versions should be evaluated annually or bi-annually to review for depreciations for security and best practice.
 * 
 * In progress. @sharletclaros 
 * 
 *
 * */



const config = {
  auth: {
    clientId: process.env.CLIENT_ID,
    tenantId: process.env.TENANT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tokenEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    scope: `${process.env.DATAVERSE_URL}/.default`,
  },
  dataverse: {
    baseUrl: process.env.DATAVERSE_URL,
    apiVersion: 'v9.1',
  },
  headers: {
    'Content-Type': 'application/json',
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    Accept: 'application/json',
  },
};

module.exports = config;
