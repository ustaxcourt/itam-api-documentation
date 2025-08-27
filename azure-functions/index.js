
import { app } from '@azure/functions';
import './helloworld.js'; // Import your function(s) here

app.setup({
  enableHttpStream: true
});
