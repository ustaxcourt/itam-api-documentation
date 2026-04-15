import { app } from '@azure/functions';

// Import your function(s) here
import './apiController/assetAssignments.js';
import './apiController/queryAsset.js';
import './apiController/authTest.js';
import './apiController/locationAssignment.js';
import './apiController/queryAssetsByEmail.js';
import './apiController/getRequirementsForJobTitleRequestHandler.js';
import './apiController/decommissionAsset.js';
import './apiController/recommissionAsset.js';
import './apiController/assetSearch.js';

app.setup({
  enableHttpStream: true,
});
