// Utility function to format relative time from a given date (used for posts timestamps)
export function formatRelativeTime(createdAt) {
  if (!createdAt) return "Recently";
  try {
    // Calculate the time difference
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    // Determine the appropriate format
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
