import React, { useState, useEffect } from 'react';
import PostActions from './PostActions';
import LinkPreview from './LinkPreview';
import { deletePost } from '../api';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Extract first URL from text
function extractUrl(text) {
  if (!text) return null;
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

export default function PostCard({ post, isPremium, userId, onLockTap, isAdmin, adminSecret, onDeleted, postRef, adUrl }) {
  const isLocked = post.tier === 'premium' && !isPremium;
  const [mediaUrl, setMediaUrl]         = useState(null);
  const [mediaError, setMediaError]     = useState(false);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => {
    if (!isLocked && post.file_id) {
      setMediaUrl(`${BACKEND}/api/posts/media/${post.file_id}`);
    }
  }, [post.file_id, isLocked]);

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(post.id, adminSecret);
      onDeleted?.(post.id);
    } catch (err) {
      alert('Failed to delete post.');
      setDeleting(false);
    }
  }

  const AD_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours

  function handleMediaTap() {
    if (!adUrl) return;
    const key = `ad_last_click_${userId}`;
    const last = localStorage.getItem(key);
    const now = Date.now();
    if (!last || now - parseInt(last) >= AD_COOLDOWN_MS) {
      localStorage.setItem(key, String(now));
      window.open(adUrl, '_blank');
    }
  }

  function renderMedia() {
    if (isLocked) {
      return (
        <button
          onClick={onLockTap}
          className="flex flex-col items-center gap-2 text-amber-400"
        >
          <span className="text-4xl">🔒</span>
          <span className="text-sm font-semibold">Premium</span>
        </button>
      );
    }

    if (!post.file_id) return null;

    if (mediaError) {
      return <span className="text-gray-600 text-sm">Media unavailable</span>;
    }

    if (post.type === 'video') {
      return (
        <div className="relative w-full">
        <video
          src={mediaUrl}
          controls
          playsInline
          className="w-full max-h-[400px] object-contain"
          onError={() => setMediaError(true)}
        />
        {/* Transparent tap catcher — only intercepts first tap to fire ad */}
        <div className="absolute inset-0" onClick={handleMediaTap} />
      </div>
      );
    }

    // image or document preview
    return (
      <img
        src={mediaUrl}
        alt={post.caption || 'post'}
        className="w-full max-h-[400px] object-contain cursor-pointer"
        onClick={handleMediaTap}
        onError={() => setMediaError(true)}
      />
    );
  }

  if (deleting) return null;

  return (
    <>
      <div ref={postRef} className="bg-card border border-border rounded-2xl overflow-hidden mb-4">

        {/* Media */}
        <div className="relative bg-[#111] min-h-[180px] flex items-center justify-center">
          {renderMedia()}

          {/* Tier badge */}
          {post.tier === 'premium' && (
            <span className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              ⭐ Premium
            </span>
          )}

          {/* Admin delete button */}
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              🗑 Delete
            </button>
          )}
        </div>

        {/* Caption — URL stripped out since it shows in the link preview box */}
        {(() => {
          const text = post.caption?.replace(/https?:\/\/[^\s]+/g, '').trim();
          if (!text) return null;
          return (
            <div className="p-3 text-sm text-gray-300">
              {isLocked ? text.slice(0, 60) + '...' : text}
            </div>
          );
        })()}

        {/* Link preview */}
        {!isLocked && extractUrl(post.caption) && (
          <LinkPreview url={extractUrl(post.caption)} />
        )}

        {/* Date */}
        <div className="px-3 pb-2 text-xs text-gray-600">
          {new Date(post.created_at).toLocaleDateString()}
        </div>

        {/* Actions — likes, comments, bookmarks */}
        <PostActions
          post={post}
          userId={userId}

        />
      </div>

    </>
  );
}
