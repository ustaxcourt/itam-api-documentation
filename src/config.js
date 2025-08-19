/**
 * Very very early iteration of this file. Have yet to make major modifications and still configuring
 * which files and packages need to be installed and added. 
 * 
 * dotenv is a standard package that handles environment variables.
 * Aim is to use this tool / package (as we need Node.js to use it) to do our variable handling
 * 
 * In progress. @sharletclaros 
 * */

require('dotenv').config();

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
