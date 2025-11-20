import { app } from '@azure/functions';
// Import your function(s) here
import './apiController/assetAssignments.js';
import './apiController/queryAsset.js';
import './apiController/authTest.js';
import './apiController/locationAssignment.js';

app.setup({
  enableHttpStream: true,
});
