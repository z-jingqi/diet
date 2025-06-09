import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Timer } from "lucide-react";
import type { RecipeStep } from "@/types/recipe";

interface RecipeStepsProps {
  steps: RecipeStep[];
}

const RecipeSteps = ({ steps }: RecipeStepsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>烹饪步骤</CardTitle>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <Timer className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default RecipeSteps; 
