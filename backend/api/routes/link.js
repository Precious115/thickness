const router = require('express').Router();
const { getActiveLink, clearActiveLink } = require('../../modules/link');

// Frontend fetches this on load
router.get('/', async (req, res) => {
  try {
    const link = await getActiveLink();
    res.json({ success: true, link: link || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin can clear the active link
router.delete('/', async (req, res) => {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (req.headers['x-admin-secret'] !== adminSecret) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await clearActiveLink();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
