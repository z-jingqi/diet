import { useParams } from "@tanstack/react-router";
import { useRecipeDetail } from "@/lib/gql/hooks/recipe-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Utensils, Clock, DollarSign } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const RecipePage = () => {
  // 从URL获取菜谱ID
  const { id } = useParams({ from: "/recipe/$id" });
  
  // 获取菜谱详情
  const { data: recipe, isLoading, error } = useRecipeDetail(id);
  
  // 解析菜谱数据
  const ingredients = recipe?.ingredientsJson ? JSON.parse(recipe.ingredientsJson) : [];
  const steps = recipe?.stepsJson ? JSON.parse(recipe.stepsJson) : [];
  const nutrients = recipe?.nutrientsJson ? JSON.parse(recipe.nutrientsJson) : {};
  
  // 计算总时间
  const totalTime = recipe?.totalTimeApproxMin 
    ? `${Math.floor(recipe.totalTimeApproxMin / 60) > 0 ? `${Math.floor(recipe.totalTimeApproxMin / 60)}小时` : ''}${recipe.totalTimeApproxMin % 60 > 0 ? ` ${recipe.totalTimeApproxMin % 60}分钟` : ''}`
    : '未知';
    
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <Typography variant="h3" className="text-red-500 mb-4">菜谱加载失败</Typography>
        <Typography variant="p" className="mb-6">无法加载菜谱信息，请稍后再试</Typography>
        <Button asChild>
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* 返回按钮 */}
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Link>
      </Button>
      
      {/* 菜谱标题 */}
      <div className="mb-8">
        {isLoading ? (
          <Skeleton className="h-10 w-3/4 mb-2" />
        ) : (
          <Typography variant="h2" className="text-2xl md:text-3xl font-bold">
            {recipe?.name || '加载中...'}
          </Typography>
        )}
        
        {isLoading ? (
          <Skeleton className="h-6 w-1/2" />
        ) : (
          <Typography variant="p" className="text-muted-foreground">
            {recipe?.description || ''}
          </Typography>
        )}
      </div>
      
      {/* 菜谱基本信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
          <Utensils className="h-5 w-5 text-primary mb-1" />
          <Typography variant="span" className="text-xs text-muted-foreground">份量</Typography>
          <Typography variant="span" className="text-sm font-medium">
            {isLoading ? <Skeleton className="h-4 w-16" /> : `${recipe?.servings || 2}人份`}
          </Typography>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
          <Clock className="h-5 w-5 text-primary mb-1" />
          <Typography variant="span" className="text-xs text-muted-foreground">烹饪时间</Typography>
          <Typography variant="span" className="text-sm font-medium">
            {isLoading ? <Skeleton className="h-4 w-16" /> : totalTime}
          </Typography>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
          <Calendar className="h-5 w-5 text-primary mb-1" />
          <Typography variant="span" className="text-xs text-muted-foreground">难度</Typography>
          <Typography variant="span" className="text-sm font-medium">
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              recipe?.difficulty === 'EASY' ? '简单' : 
              recipe?.difficulty === 'MEDIUM' ? '中等' : 
              recipe?.difficulty === 'HARD' ? '困难' : '未知'
            )}
          </Typography>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-muted/40 rounded-lg">
          <DollarSign className="h-5 w-5 text-primary mb-1" />
          <Typography variant="span" className="text-xs text-muted-foreground">预估成本</Typography>
          <Typography variant="span" className="text-sm font-medium">
            {isLoading ? 
              <Skeleton className="h-4 w-16" /> : 
              recipe?.costApprox ? `¥${recipe.costApprox}` : '未知'
            }
          </Typography>
        </div>
      </div>
      
      {/* 食材列表 */}
      <div className="mb-8">
        <Typography variant="h3" className="text-xl font-semibold mb-4">
          食材
        </Typography>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4">
            <ul className="space-y-2">
              {ingredients.map((ing: any, index: number) => (
                <li key={index} className="flex justify-between py-1 border-b border-dashed border-muted-foreground/20 last:border-0">
                  <span className="font-medium">{ing.name}</span>
                  <div className="text-muted-foreground text-sm">
                    <span>{ing.amount}</span>
                    {ing.notes && <span className="ml-2 text-xs">({ing.notes})</span>}
                  </div>
                </li>
              ))}
              {ingredients.length === 0 && (
                <li className="text-center text-muted-foreground py-2">暂无食材信息</li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      {/* 烹饪步骤 */}
      <div className="mb-8">
        <Typography variant="h3" className="text-xl font-semibold mb-4">
          烹饪步骤
        </Typography>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ol className="space-y-6">
            {steps.map((step: any, index: number) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {step.step}
                </div>
                <div className="flex-1">
                  <Typography variant="p" className="mb-1">
                    {step.description}
                  </Typography>
                  {step.tips && (
                    <Typography variant="p" className="text-sm bg-muted/40 p-2 rounded-md mt-2 text-muted-foreground">
                      提示：{step.tips}
                    </Typography>
                  )}
                </div>
              </li>
            ))}
            {steps.length === 0 && (
              <li className="text-center text-muted-foreground py-2">暂无步骤信息</li>
            )}
          </ol>
        )}
      </div>
      
      {/* 营养信息 */}
      {(nutrients && Object.keys(nutrients).length > 0) && (
        <div className="mb-8">
          <Typography variant="h3" className="text-xl font-semibold mb-4">
            营养信息
          </Typography>
          
          <div className="bg-muted/30 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(nutrients).map(([key, value]) => (
              <div key={key} className="text-center">
                <Typography variant="span" className="text-sm font-medium">
                  {key === 'calories' ? '热量' : 
                   key === 'protein' ? '蛋白质' :
                   key === 'carbs' ? '碳水' :
                   key === 'fat' ? '脂肪' :
                   key === 'fiber' ? '纤维' : key}
                </Typography>
                <Typography variant="p" className="text-lg">
                  {String(value)}
                  {key === 'calories' ? '卡' : ''}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 小贴士 */}
      {recipe?.tips && (
        <div className="mb-8">
          <Typography variant="h3" className="text-xl font-semibold mb-4">
            小贴士
          </Typography>
          <div className="bg-muted/30 rounded-lg p-4">
            <Typography variant="p">{recipe.tips}</Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
