const router = require('express').Router();
const { getOrCreateUser, getUserById } = require('../../modules/users');

router.post('/login', async (req, res) => {
  try {
    const { telegram_user } = req.body;
    if (!telegram_user) return res.status(400).json({ error: 'No telegram_user provided' });

    const user = await getOrCreateUser(telegram_user);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:telegram_id', async (req, res) => {
  try {
    const user = await getUserById(req.params.telegram_id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
