const { activateSubscription } = require('../subscriptions');
const PRODUCTS = require('../../config/products');

async function fulfillPayment(productKey, telegramId, ctx) {
  const product = Object.values(PRODUCTS).find(p => p.key === productKey);
  if (!product) return;

  await activateSubscription(telegramId, product.days);

  const label = product.label;
  await ctx.reply(`✅ ${label} activated! You now have full access to premium content. 🌟`);
}

module.exports = { fulfillPayment };
