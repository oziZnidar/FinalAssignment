import { Router } from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all resources
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('travel_resources').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new resource
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, link_url } = req.body;
    const { error } = await supabase.from('travel_resources').insert([{ title, description, link_url }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a resource
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, link_url } = req.body;
    const { error } = await supabase.from('travel_resources').update({ title, description, link_url }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a resource
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.from('travel_resources').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;