// proxy-server.js
import express from 'express';
import fetch from 'node-fetch'; // or just global fetch in Node 18+
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow your frontend origin
app.use(
  cors({
    origin: 'https://gentle-coast-05e458303.1.azurestaticapps.net',
  })
);

// Proxy for groups
app.get('/api/groups', async (req, res) => {
  try {
    const response = await fetch('https://studynester.onrender.com/groups');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Proxy for sessions
app.get('/api/sessions/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const response = await fetch(`https://studynester.onrender.com/sessions/${groupId}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));

app.get('/', (req, res) => {
  res.send('✅ Proxy server is running. Use /api/groups or /api/sessions/:groupId');
});
