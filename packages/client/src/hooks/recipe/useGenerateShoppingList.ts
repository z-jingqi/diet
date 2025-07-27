import React from "react";
import { Recipe } from "@/lib/gql/graphql";
import { sendMessage } from "@/lib/api/base-api";

export interface ShoppingItem {
  name: string;
  quantity: number | string;
  unit?: string;
  notes?: string[];
  purchased?: boolean;
}

interface UseGenerateShoppingListReturn {
  generating: boolean;
  buildLocalList: () => ShoppingItem[];
  optimizeListWithAI: (
    baseList: ShoppingItem[],
  ) => Promise<ShoppingItem[] | null>;
}

/**
 * 根据多道菜谱的 ingredientsJson 调用 AI 生成购物清单。
 * 返回的购物清单不包含 purchased 字段，hook 会附加默认值。
 */
export const useGenerateShoppingList = (
  recipes: Recipe[],
): UseGenerateShoppingListReturn => {
  const [generating, setGenerating] = React.useState(false);

  // 前端快速合并，生成基础列表
  const buildLocalList = React.useCallback((): ShoppingItem[] => {
    const map: Record<string, ShoppingItem> = {};

    recipes.forEach((rec) => {
      if (!rec?.ingredientsJson) {
        return;
      }

      try {
        const list = JSON.parse(rec.ingredientsJson);
        list.forEach((ing: any) => {
          const key = `${ing.name}-${ing.unit ?? ""}`;
          if (!map[key]) {
            map[key] = {
              name: ing.name,
              quantity: ing.quantity ?? ing.amount ?? 0,
              unit: ing.unit,
              notes: ing.note ? [ing.note] : [],
              purchased: false,
            };
          } else {
            const existing = map[key];
            const qty = ing.quantity ?? ing.amount;
            if (
              typeof qty === "number" &&
              typeof existing.quantity === "number"
            ) {
              existing.quantity += qty;
            } else if (qty) {
              existing.notes?.push(String(qty));
            }
            if (ing.note) {
              existing.notes?.push(ing.note);
            }
          }
        });
      } catch (e) {
        console.error("解析 ingredientsJson 失败", e);
      }
    });

    return Object.values(map);
  }, [recipes]);

  // 调用 AI 对基础列表做进一步优化
  const optimizeListWithAI = React.useCallback(
    async (baseList: ShoppingItem[]) => {
      if (baseList.length === 0) {
        return null;
      }

      setGenerating(true);
      try {
        const userContent =
          "以下 JSON 是购物清单基础版本，请你合并同义词、统一单位，并保持字段: name, quantity, unit, notes(可选)。输出 JSON 数组，不要包含 purchased 字段。\n" +
          JSON.stringify(baseList, null, 2);

        const response = await sendMessage({
          systemPrompt: "你是一位擅长整理食材清单的专业厨师助理。",
          messages: [{ role: "user", content: userContent }],
          format: "json",
        });

        if (Array.isArray(response)) {
          return (response as any[]).map((it) => ({
            ...it,
            purchased: false,
          })) as ShoppingItem[];
        }
        return null;
      } catch (e) {
        console.error("优化购物清单失败", e);
        return null;
      } finally {
        setGenerating(false);
      }
    },
    [],
  );

  return { generating, buildLocalList, optimizeListWithAI };
};

export default useGenerateShoppingList;
