import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mainRouter from './src/routes/mainRoutes.js';

const app = express();
const port = 4000;


app.use(cors());
app.use(bodyParser.json());

app.use('/api', mainRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
