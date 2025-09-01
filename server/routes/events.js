import express from "express";
import { supabase } from "../index.js"; // server-side supabase

const router = express.Router();

// GET /api/events - fetch upcoming events
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString()) // only future events
      .order("date", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
