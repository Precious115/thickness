const supabase = require('../../supabase');

async function addComment(userId, postId, text) {
  const { data } = await supabase
    .from('comments')
    .insert({ user_id: userId, post_id: postId, text })
    .select()
    .single();

  await supabase.from('notifications').insert({
    user_id: userId,
    message: `Someone commented on your post 💬`,
    read: false,
  });

  return data;
}

async function getComments(postId) {
  const { data } = await supabase
    .from('comments')
    .select('*, users(username, first_name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  return data || [];
}

async function getCommentCount(postId) {
  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
  return count || 0;
}

module.exports = { addComment, getComments, getCommentCount };
