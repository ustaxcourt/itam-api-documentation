
import { app } from '@azure/functions';
import './helloworld.js'; // Import your function(s) here
import './testAuth.js';
import './queryAssets.js';

import './queryAsset.js';
import './authCallback.js';

app.setup({
  enableHttpStream: true
});
