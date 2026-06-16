import express, { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('destinations').select('content').eq('id', 1).maybeSingle();
    if (error) throw error;
    res.json({ content: data?.content || "Click edit to establish your destination log!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const { error } = await supabase.from('destinations').upsert({ id: 1, content });
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;