import express from 'express';
import cors from 'cors';
import destinationsRouter from './routes/destinations.js';
import aboutRouter from './routes/about.js';
import blogRouter from './routes/blog.js';
import resourcesRouter from './routes/resources.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/destinations', destinationsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/blog', blogRouter);
app.use('/api/resources', resourcesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Node.js Core API Gateway listening on http://localhost:${PORT}`);
});