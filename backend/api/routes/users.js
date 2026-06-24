const router = require('express').Router();
const { getOrCreateUser, getUserById, verifyTelegramInitData } = require('../../modules/users');

router.post('/login', async (req, res) => {
  try {
    const { init_data } = req.body;
    if (!init_data) return res.status(400).json({ error: 'No init_data provided' });

    const telegramUser = verifyTelegramInitData(init_data);
    if (!telegramUser) return res.status(401).json({ error: 'Invalid Telegram data' });

    const user = await getOrCreateUser(telegramUser);
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
