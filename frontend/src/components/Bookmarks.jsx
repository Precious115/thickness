import React, { useEffect, useState } from 'react';
import { getUserBookmarks } from '../api';
import PostCard from './PostCard';

export default function Bookmarks({ userId, isPremium }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getUserBookmarks(userId);
        setBookmarks(res.data.bookmarks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10 text-sm">Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 gap-3">
        <span className="text-4xl">🏷️</span>
        <p className="text-gray-500 text-sm">No bookmarks yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto pb-20">
      {bookmarks.map(b => (
        <PostCard
          key={b.post_id}
          post={b.posts}
          isPremium={isPremium}
          userId={userId}
          onLockTap={() => {}}
        />
      ))}
    </div>
  );
}
