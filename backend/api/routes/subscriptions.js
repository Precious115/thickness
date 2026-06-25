const router = require('express').Router();
const { checkSubscription, activateSubscription } = require('../../modules/subscriptions');

// DevBoost — bypass paywall for 24h (protected by secret)
router.post('/devboost', async (req, res) => {
  try {
    const { telegram_id, secret } = req.body;
    if (secret !== process.env.DEV_BOOST_SECRET) {
      return res.status(403).json({ error: 'Invalid secret' });
    }
    if (!telegram_id) return res.status(400).json({ error: 'Missing telegram_id' });
    await activateSubscription(telegram_id, 1); // 1 day
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:telegram_id', async (req, res) => {
  try {
    const status = await checkSubscription(req.params.telegram_id);
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
