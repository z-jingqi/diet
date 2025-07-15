// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import RecipeEditPage from "@/pages/RecipeEditPage";

export const Route = createFileRoute("/recipe/$id/edit")({
  component: RecipeEditPage,
}); 