/**
 * Format a date as a relative time string
 * @param date The date to format
 * @returns A string like "just now", "5 minutes ago", "2 days ago", etc.
 */
export const formatRelativeTimeV2 = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    // Format as MM/DD/YYYY
    return date.toLocaleDateString();
  }
};

/**
 * Group chat sessions by recency
 */
export const groupSessionsByRecencyV2 = <T extends { createdAt: string | Date, updatedAt?: string | Date | null }>(
  sessions: T[]
): {
  recent: T[];
  yesterday: T[];
  thisWeek: T[];
  thisMonth: T[];
  older: T[];
} => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return sessions.reduce((result, session) => {
    // Use updatedAt if available, otherwise createdAt
    const sessionDate = new Date(session.updatedAt || session.createdAt);
    
    if (sessionDate >= oneDayAgo) {
      result.recent.push(session);
    } else if (sessionDate >= oneWeekAgo) {
      result.yesterday.push(session);
    } else if (sessionDate >= oneMonthAgo) {
      result.thisWeek.push(session);
    } else {
      result.older.push(session);
    }
    
    return result;
  }, {
    recent: [] as T[],
    yesterday: [] as T[],
    thisWeek: [] as T[],
    thisMonth: [] as T[],
    older: [] as T[]
  });
}; 
