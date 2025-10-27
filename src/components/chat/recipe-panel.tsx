"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import type { Recipe } from "@/types/recipe";

export type RecipePanelProps = {
  recipe: Recipe;
  onClose?: () => void;
};

export function RecipePanel({ recipe, onClose }: RecipePanelProps) {
  return (
    <section className="flex flex-1 flex-col overflow-hidden border-l bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TypographyP className="text-lg font-semibold">
            {recipe.title}
          </TypographyP>
          {recipe.description && (
            <TypographyMuted className="mt-2 text-sm leading-relaxed">
              {recipe.description}
            </TypographyMuted>
          )}
        </div>
        {onClose ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close recipe panel</span>
          </Button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {typeof recipe.servings === "number" && (
          <span>Servings: {recipe.servings}</span>
        )}
        {typeof recipe.prepTimeMinutes === "number" && (
          <span>Prep: {recipe.prepTimeMinutes} min</span>
        )}
        {typeof recipe.cookTimeMinutes === "number" && (
          <span>Cook: {recipe.cookTimeMinutes} min</span>
        )}
        {recipe.difficulty && <span>Difficulty: {recipe.difficulty}</span>}
      </div>

      <div className="mt-6 flex-1 space-y-6 overflow-y-auto">
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section>
            <TypographyP className="text-sm font-semibold uppercase tracking-wide">
              Ingredients
            </TypographyP>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {recipe.ingredients.map((item, index) => (
                <li key={index} className="flex flex-col">
                  <span>
                    {item.amount ? `${item.amount} ` : ""}
                    {item.unit ? `${item.unit} ` : ""}
                    {item.name}
                  </span>
                  {item.notes && (
                    <span className="text-xs italic">{item.notes}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <section>
            <TypographyP className="text-sm font-semibold uppercase tracking-wide">
              Steps
            </TypographyP>
            <ol className="mt-2 space-y-3 text-sm text-muted-foreground">
              {recipe.steps
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <li key={step.order} className="space-y-1">
                    <div>
                      <span className="font-semibold">Step {step.order}:</span>{" "}
                      {step.instruction}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {typeof step.durationMinutes === "number" && (
                        <span>~{step.durationMinutes} min</span>
                      )}
                      {step.temperature && (
                        <span>Heat: {step.temperature}</span>
                      )}
                      {step.tools && step.tools.length > 0 && (
                        <span>Tools: {step.tools.join(", ")}</span>
                      )}
                    </div>
                    {step.ingredients && step.ingredients.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5 text-xs">
                        {step.ingredients.map((ingredient, ingredientIndex) => (
                          <li key={ingredientIndex}>
                            {ingredient.amount ? `${ingredient.amount} ` : ""}
                            {ingredient.unit ? `${ingredient.unit} ` : ""}
                            {ingredient.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.tips && step.tips.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5 text-xs italic">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
            </ol>
          </section>
        )}
      </div>
    </section>
  );
}
