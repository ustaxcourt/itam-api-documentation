
import { app } from '@azure/functions';
import './helloworld.js'; // Import your function(s) here
import './testAuth.js';
import './queryAssets.js';
import './assetAssignments.js';
import './queryAsset.js';
import './authTest.js';


app.setup({
  enableHttpStream: true
});
