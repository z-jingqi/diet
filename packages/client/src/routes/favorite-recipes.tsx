import { createFileRoute } from "@tanstack/react-router";
import FavoriteRecipesPage from "@/pages/FavoriteRecipesPage";

export const Route = createFileRoute("/favorite-recipes")({
  component: FavoriteRecipesPage,
});