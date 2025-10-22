
import { app } from '@azure/functions';
import './helloworld.js'; // Import your function(s) here
import './testAuth.js';
import './queryAssets.js';

import './queryAsset.js';
import './authCallback.js';
import './startAuth.js';
import './storeTokens.js';
import './login.js';
import './refreshToken.js';


app.setup({
  enableHttpStream: true
});
