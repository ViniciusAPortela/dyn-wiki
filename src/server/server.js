express = require("express");
import compression from 'compression';
import ssr from './routes/ssr';

const app = express();

app.use(compression);
app.use(express.static('public'));

app.use('/ssr', ssr);

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Running on ${port}`);
});