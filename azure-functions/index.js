import { app } from '@azure/functions';
// Import your function(s) here
import './testAuth.js';
import './assetAssignments.js';
import './apiController/queryAsset.js';
import './authTest.js';

app.setup({
  enableHttpStream: true,
});
