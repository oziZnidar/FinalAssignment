import express, { Router, type Request, type Response } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: posts, error: postError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postError) throw postError;

    const { data: comments, error: commentError } = await supabase.from('comments').select('*');
    if (commentError) throw commentError;

    const { data: blocked, error: blockError } = await supabase.from('blocked_users').select('username');
    if (blockError) throw blockError;

    const blockedList = blocked.map(b => b.username);

    const combinedData = posts.map(post => ({
      ...post,
      comments: comments
        .filter(c => c.post_id === post.id)
        .map(c => ({
          id: c.id,
          user: c.user_name,
          text: c.content,
          isBlocked: blockedList.includes(c.user_name)
        }))
    }));

    res.json({ posts: combinedData, blockedUsers: blockedList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Post
router.post('/posts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, body, author } = req.body;
    const { error } = await supabase.from('posts').insert([{ title, category, body, author }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Post
router.put('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, body } = req.body;
    const { error } = await supabase.from('posts').update({ title, category, body }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Post
router.delete('/posts/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Comment
router.post('/posts/:id/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, text } = req.body;
    const { error } = await supabase.from('comments').insert([{ post_id: req.params.id, user_name: user, content: text }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Comment
router.delete('/comments/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.from('comments').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block User
router.post('/block', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    const { error } = await supabase.from('blocked_users').insert([{ username }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;