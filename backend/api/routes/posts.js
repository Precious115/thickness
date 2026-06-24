const router = require('express').Router();
const { getFeed, getPostById } = require('../../modules/posts');

router.get('/feed', async (req, res) => {
  try {
    const { tier } = req.query;
    const posts = await getFeed(tier || 'free');
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:post_id', async (req, res) => {
  try {
    const post = await getPostById(req.params.post_id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
