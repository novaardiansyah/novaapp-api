import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import pool from '@/db';
import { AuthRouter, notesRouter } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
})

app.use('/api/auth', AuthRouter);
app.use('/api/notes', notesRouter);

app.get('/api/ping', async (req: Request, res: Response) => {
  console.log('Ping received');
  res.json({ message: 'Pong!' });
})

app.get('/api/dbPoolTest', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    res.json({ message: 'Hello from Express + TypeScript!', dbTime: rows });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error });
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});