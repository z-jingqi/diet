import type { HealthAdvice } from "@shared/schemas/health-advice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Typography, MutedText, ErrorText } from "@/components/ui/typography";

interface HealthAdviceMessageBubbleProps {
  content: string;
  healthAdvice?: HealthAdvice;
  status?: string;
}

const statusMap = {
  recommended: { label: "推荐", className: "bg-green-500" },
  moderate: { label: "适量", className: "bg-yellow-500" },
  not_recommended: { label: "不建议", className: "bg-orange-500" },
  forbidden: { label: "禁止", className: "bg-red-500" },
};

const typeMap = {
  diet: "饮食",
  exercise: "运动",
  lifestyle: "生活方式",
  mental: "心理",
  environment: "环境",
  social: "社交",
  seasonal: "季节",
  other: "其他",
};

/**
 * 健康建议消息气泡组件
 */
const HealthAdviceMessageBubble = ({
  content,
  healthAdvice,
  status,
}: HealthAdviceMessageBubbleProps) => {
  if (!healthAdvice && status === 'pending') {
    return <MutedText className="animate-pulse">生成健康建议中...</MutedText>;
  }
  if (!healthAdvice && status === 'error') {
    return <ErrorText>生成健康建议失败，请重试</ErrorText>;
  }
  if (!healthAdvice && status === 'abort') {
    return <MutedText>生成健康建议已中断</MutedText>;
  }
  if (!healthAdvice) {
    return <Typography variant="p">{content}</Typography>;
  }

  const statusObj = statusMap[healthAdvice.status];
  const type = typeMap[healthAdvice.type];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{healthAdvice.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{type}</Badge>
            <Badge className={cn("text-white", statusObj.className)}>
              {statusObj.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 原因分析 */}
          {healthAdvice.reasons.length > 0 && (
            <div>
              <Typography variant="h4" className="mb-2">原因分析</Typography>
              <ul className="list-disc pl-4 space-y-1">
                {healthAdvice.reasons.map((reason, index) => (
                  <li key={index}>
                    <MutedText>{reason.description}</MutedText>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 具体建议 */}
          {healthAdvice.suggestions.length > 0 && (
            <div>
              <Typography variant="h4" className="mb-2">具体建议</Typography>
              <ul className="list-disc pl-4 space-y-1">
                {healthAdvice.suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <MutedText>{suggestion.description}</MutedText>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 适用场景 */}
          {healthAdvice.scenarios.length > 0 && (
            <div>
              <Typography variant="h4" className="mb-2">适用场景</Typography>
              <ul className="list-disc pl-4 space-y-1">
                {healthAdvice.scenarios.map((scenario, index) => (
                  <li key={index}>
                    <MutedText>{scenario.condition}</MutedText>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthAdviceMessageBubble; 
