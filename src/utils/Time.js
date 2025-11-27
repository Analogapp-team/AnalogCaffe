export function formatRelativeTime(createdAt) {
  if (!createdAt) return "Recently";
  try {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  } catch (err) {
    return "Recently";
  }
}
