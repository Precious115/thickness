const router = require('express').Router();
const { getFeed, getPostById } = require('../../modules/posts');

// Proxy Telegram file so the frontend can display images/videos
router.get('/media/:file_id', async (req, res) => {
  try {
    const token  = process.env.BOT_TOKEN;
    const fileId = req.params.file_id;

    // 1. Ask Telegram for the file path
    const infoRes  = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );
    const infoJson = await infoRes.json();
    const filePath = infoJson?.result?.file_path;
    if (!filePath) return res.status(404).json({ error: 'File not found' });

    // 2. Stream the actual file back to the client
    const fileRes = await fetch(
      `https://api.telegram.org/file/bot${token}/${filePath}`
    );
    if (!fileRes.ok) return res.status(502).json({ error: 'Telegram fetch failed' });

    res.setHeader('Content-Type', fileRes.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const { Readable } = require('stream');
    Readable.fromWeb(fileRes.body).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
