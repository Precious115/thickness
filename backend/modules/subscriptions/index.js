const supabase = require('../../supabase');

async function checkSubscription(telegramId) {
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', telegramId)
    .single();

  if (!data) return { isPremium: false };

  if (data.is_lifetime) return { isPremium: true, isLifetime: true };

  const expired = data.expires_at && new Date(data.expires_at) < new Date();
  return {
    isPremium: !expired,
    expiresAt: data.expires_at,
  };
}

async function activateSubscription(telegramId, days) {
  const isLifetime = days === null;
  const expiresAt = isLifetime
    ? null
    : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', telegramId)
    .single();

  if (existing) {
    await supabase
      .from('subscriptions')
      .update({
        is_lifetime: isLifetime,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', telegramId);
  } else {
    await supabase.from('subscriptions').insert({
      user_id: telegramId,
      is_lifetime: isLifetime,
      expires_at: expiresAt,
    });
  }

  return { success: true };
}

module.exports = { checkSubscription, activateSubscription };
