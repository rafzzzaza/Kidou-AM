const express = require('express');
const { getStats } = require('../../../lib/stats'); // sesuaikan path ke lib/stats.js kamu

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Matikan cache Vercel biar data real-time
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    const stats = await getStats();
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;