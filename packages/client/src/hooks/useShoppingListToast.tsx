import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

interface UseShoppingListToastOptions {
  /**
   * 自定义跳转路径，默认为 "/shopping-list"
   */
  redirectPath?: string;
}

/**
 * 购物清单提示 Hook
 * 用于检查本地购物清单并在有未完成购物清单时显示提示
 */
const useShoppingListToast = (options: UseShoppingListToastOptions = {}) => {
  const { redirectPath = "/shopping-list" } = options;
  const navigate = useNavigate();
  const [hasShownToast, setHasShownToast] = React.useState(false);

  // 检查并显示购物清单提示
  React.useEffect(() => {
    const stored = localStorage.getItem("shoppingListData");
    if (stored && !hasShownToast) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          toast.custom(
            (t: any) => {
              return (
                <div className="flex items-center justify-between p-4 bg-popover border rounded-md shadow-lg w-auto">
                  <span className="text-sm font-medium">
                    存在未完成的购物清单
                  </span>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        navigate({ to: redirectPath });
                        toast.dismiss(t.id as string);
                      }}
                    >
                      查看
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem("shoppingListData");
                        toast.dismiss(t.id as string);
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              );
            },
            { duration: Infinity, id: "shopping-list-toast" },
          );
          setHasShownToast(true);
        }
      } catch (e) {
        console.error("解析本地购物清单失败", e);
      }
    }

    // 组件卸载时关闭toast提示
    return () => {
      if (hasShownToast) {
        toast.dismiss("shopping-list-toast");
      }
    };
  }, [hasShownToast, navigate, redirectPath]);

  // 显式调用来重新检查和显示购物清单提示
  const checkShoppingList = React.useCallback(() => {
    setHasShownToast(false);
  }, []);

  // 手动关闭提示
  const dismissToast = React.useCallback(() => {
    toast.dismiss("shopping-list-toast");
  }, []);

  return {
    checkShoppingList,
    dismissToast,
  };
};

export default useShoppingListToast; 