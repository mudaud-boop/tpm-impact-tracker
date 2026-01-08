import express from 'express';
import cors from 'cors';
import { impactsRouter } from './routes/impacts.js';
import { aiRouter } from './routes/ai.js';
import { statsRouter } from './routes/stats.js';
import { summaryRouter } from './routes/summary.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/impacts', impactsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/stats', statsRouter);
app.use('/api/summary', summaryRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
