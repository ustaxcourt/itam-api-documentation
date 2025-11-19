import { app } from '@azure/functions';
// Import your function(s) here
import './apiController/assetAssignments.js';
import './apiController/queryAsset.js';
import './authTest.js';

app.setup({
  enableHttpStream: true,
});
