import { Button } from "@/components/ui/button";
import { Clock, Timer } from "lucide-react";
import type { RecipeStep } from "@shared/schemas/recipe";
import ExpandableCard from "./ExpandableCard";
import { Typography, MutedText } from "@/components/ui/typography";

interface RecipeStepsProps {
  steps: RecipeStep[];
}

const RecipeSteps = ({ steps }: RecipeStepsProps) => {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <Timer className="h-4 w-4 mr-2" />
          开始烹饪
        </Button>
      </div>
      <div className="grid gap-6">
        {steps.map((step, index) => (
          <div key={index} className="p-4 rounded-lg border space-y-4">
            <div className="flex items-center gap-2">
              <MutedText>{index + 1}.</MutedText>
              <Typography variant="span" className="font-medium">
                {step.description}
              </Typography>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <MutedText>{step.time} 分钟</MutedText>
            </div>
            {step.tips && (
              <div className="bg-muted p-3 rounded-md">
                <MutedText>小贴士：{step.tips}</MutedText>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableCard title="烹饪步骤" expandedContent={expandedContent}>
      <ul className="space-y-6">
        {steps.map((step, index) => (
          <li key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <MutedText>{index + 1}.</MutedText>
              <Typography variant="span">{step.description}</Typography>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <MutedText>{step.time}秒</MutedText>
            </div>
            {step.tips && <MutedText className="pl-6">小贴士：{step.tips}</MutedText>}
          </li>
        ))}
      </ul>
    </ExpandableCard>
  );
};

export default RecipeSteps;
