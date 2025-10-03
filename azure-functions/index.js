
import { app } from '@azure/functions';
import './helloworld.js'; // Import your function(s) here
import './testAuth.js';
import './queryAssets.js';

<<<<<<< HEAD
import './queryAsset.js';

=======
>>>>>>> e2c2335 (new branch. updated terraform files. updated readme. removed some files no longer in use.)
app.setup({
  enableHttpStream: true
});
