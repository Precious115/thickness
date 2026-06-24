import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function SubscriptionBadge({ isPremium, expiresAt }) {
  const { t } = useLanguage();

  if (!isPremium) return null;

  return (
    <div className="flex items-center gap-1 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
      <span>⭐</span>
      <span>{t('activeSubscription')}</span>
      {expiresAt && (
        <span className="opacity-70">
          · {new Date(expiresAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
