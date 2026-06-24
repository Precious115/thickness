require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bot = require('./bot');
const paymentsModule = require('./api/routes/payments');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS — only allow your Vercel frontend ────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use(express.json());

// ── Rate limiting — max 60 requests per minute per IP ────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, slow down.' },
});
app.use('/api/', limiter);

// Health check — keeps Render alive
app.get('/',       (req, res) => res.json({ status: 'Thickness Backend Running 🌟' }));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users',         require('./api/routes/users'));
app.use('/api/posts',         require('./api/routes/posts'));
app.use('/api/subscriptions', require('./api/routes/subscriptions'));
app.use('/api/payments',      paymentsModule.router);

// Inject bot into payments module
paymentsModule.setBot(bot);

// ── Start bot and server ──────────────────────────────────────────────────────
bot.launch();
console.log('🤖 Thickness Bot is running...');

process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.listen(PORT, () => {
  console.log(`🌟 Thickness Backend running on port ${PORT}`);
});
