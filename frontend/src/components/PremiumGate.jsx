import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { createInvoice } from '../api';

const PRODUCTS = [
  { key: 'premium_1_month',   label: '1 Month',   stars: 100 },
  { key: 'premium_3_months',  label: '3 Months',  stars: 250 },
  { key: 'premium_lifetime',  label: 'Lifetime',  stars: 500 },
];

export default function PremiumGate({ telegramId, onUnlocked }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handlePurchase(productKey) {
    try {
      setLoading(true);
      const res = await createInvoice(telegramId, productKey);
      const invoiceUrl = res.data.invoice;
      window.Telegram.WebApp.openInvoice(invoiceUrl, (status) => {
        if (status === 'paid') onUnlocked();
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-5xl">🔒</div>
      <h2 className="text-xl font-bold text-white">{t('premiumContent')}</h2>
      <p className="text-gray-400 text-sm">{t('lockedMessage')}</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {PRODUCTS.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePurchase(p.key)}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-xl transition disabled:opacity-50"
          >
            {p.label} · {p.stars} ⭐
          </button>
        ))}
      </div>
    </div>
  );
}
