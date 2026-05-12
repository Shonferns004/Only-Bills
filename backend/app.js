import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { train } from './src/ml/model.js';
import { supabase } from './src/config/supabase.js';
import { startKeepAlive } from './src/config/keepAlive.js';
import mainRouter from './src/routes/mainRoutes.js';
import authRouter from './src/routes/authRoutes.js';
import chatRouter from './src/routes/chatRoutes.js';
import predictRouter from './src/routes/predictRoutes.js';
import dataRouter from './src/routes/dataRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', mainRouter);
app.use('/api/auth', authRouter);
app.use('/api', chatRouter);
app.use('/api', predictRouter);
app.use('/api/data', dataRouter);

app.get('/api/health', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'ok', users: count, time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

train();
startKeepAlive();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
