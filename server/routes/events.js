import express from 'express';
import { supabase } from '../index.js'; // server-side supabase

const router = express.Router();

// GET /api/events - fetch upcoming events.
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - create a new event
router.post('/', async (req, res) => {
  try {
    const { title, date, location, description, exec_id, poster_image, category } = req.body;

    // insert into Supabase
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, date, location, description, exec_id, poster_image, category }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]); // return the created event
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
