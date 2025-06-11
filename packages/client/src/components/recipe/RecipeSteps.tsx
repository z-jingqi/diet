import { Button } from '@/components/ui/button';
import { Clock, Timer } from "lucide-react";
import type { RecipeStep } from '@/types/recipe';
import ExpandableCard from './ExpandableCard';

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
        {steps.map((step) => (
          <div
            key={step.order}
            className="p-4 rounded-lg border space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{step.order}.</span>
              <span className="font-medium">{step.description}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{step.time}秒</span>
            </div>
            {step.tips && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  小贴士：{step.tips}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="烹饪步骤"
      expandedContent={expandedContent}
    >
      <ul className="space-y-6">
        {steps.map((step) => (
          <li key={step.order} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{step.order}.</span>
              <span>{step.description}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{step.time}秒</span>
            </div>
            {step.tips && (
              <p className="text-sm text-muted-foreground pl-6">
                小贴士：{step.tips}
              </p>
            )}
          </li>
        ))}
      </ul>
    </ExpandableCard>
  );
};

export default RecipeSteps; 
