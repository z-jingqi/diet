import React from "react";
import { useParams, useNavigate, Link } from "@tanstack/react-router";
import { useRecipeDetail, useUpdateRecipe } from "@/lib/gql/hooks/recipe-hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { Difficulty } from "@/lib/gql/graphql";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RecipeEditPage: React.FC = () => {
  const { id } = useParams({ from: "/recipe/$id" });
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipeDetail(id);
  const updateRecipe = useUpdateRecipe();

  const [form, setForm] = React.useState({
    name: "",
    description: "",
    servings: 2,
    difficulty: Difficulty.Easy as Difficulty,
  });

  React.useEffect(() => {
    if (recipe) {
      setForm({
        name: recipe.name ?? "",
        description: recipe.description ?? "",
        servings: recipe.servings ?? 2,
        difficulty: recipe.difficulty ?? Difficulty.Easy,
      });
    }
  }, [recipe]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "servings" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRecipe.mutateAsync({
      id,
      input: {
        name: form.name,
        description: form.description,
        servings: Number(form.servings),
        difficulty: form.difficulty,
        ingredientsJson: recipe?.ingredientsJson ?? "[]",
        stepsJson: recipe?.stepsJson ?? "[]",
      },
    });
    navigate({ to: "/recipe/$id", params: { id } });
  };

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <Typography variant="h3" className="text-red-500 mb-4">
          加载失败
        </Typography>
        <Typography variant="p" className="mb-6">
          无法加载菜谱，请稍后再试
        </Typography>
        <Button asChild>
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate({ to: "/recipe/$id", params: { id } })}
      >
        返回
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>编辑菜谱</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Typography variant="span" className="font-medium">名称</Typography>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Typography variant="span" className="font-medium">描述</Typography>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="span" className="font-medium">份量</Typography>
                  <Input
                    type="number"
                    name="servings"
                    value={form.servings}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
                <div>
                  <Typography variant="span" className="font-medium">难度</Typography>
                  <Select
                    value={form.difficulty}
                    onValueChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        difficulty: v as Difficulty,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择难度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Difficulty.Easy}>简单</SelectItem>
                      <SelectItem value={Difficulty.Medium}>中等</SelectItem>
                      <SelectItem value={Difficulty.Hard}>困难</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={updateRecipe.isPending}>
                保存
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeEditPage; 