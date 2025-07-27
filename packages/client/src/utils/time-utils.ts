import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// 配置dayjs
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

/**
 * 格式化会话历史时间显示
 * @param date 要格式化的日期
 * @returns 格式化后的时间字符串
 */
export const formatSessionTime = (date: Date): string => {
  const now = dayjs();
  const sessionTime = dayjs(date);
  const diffInDays = now.diff(sessionTime, "day");

  if (diffInDays === 0) {
    // 今天显示具体时间
    return sessionTime.format("HH:mm:ss");
  } else if (diffInDays < 7) {
    // 一周内显示月日
    return sessionTime.format("MM-DD");
  } else {
    // 超过一周显示完整日期
    return sessionTime.format("YYYY-MM-DD");
  }
};

/**
 * 按时间分类会话
 * @param sessions 会话列表
 * @returns 分类后的会话对象
 */
export const categorizeSessions = (sessions: any[]) => {
  const now = dayjs();

  const categorized = {
    recent: [] as any[],
    threeDaysAgo: [] as any[],
    oneWeekAgo: [] as any[],
    oneMonthAgo: [] as any[],
    older: [] as any[],
  };

  sessions.forEach((session) => {
    const sessionTime = dayjs(session.updatedAt);
    const diffInDays = now.diff(sessionTime, "day");

    if (diffInDays === 0) {
      categorized.recent.push(session);
    } else if (diffInDays <= 3) {
      categorized.threeDaysAgo.push(session);
    } else if (diffInDays <= 7) {
      categorized.oneWeekAgo.push(session);
    } else if (diffInDays <= 30) {
      categorized.oneMonthAgo.push(session);
    } else {
      categorized.older.push(session);
    }
  });

  // 对每个分类内的会话按更新时间降序排序（最新的在前面）
  Object.keys(categorized).forEach((key) => {
    categorized[key as keyof typeof categorized].sort(
      (a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf(),
    );
  });

  return categorized;
};

export default dayjs;
