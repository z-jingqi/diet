import React from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

interface BatchActionToolbarProps {
  selectedCount: number;
  totalCount: number;
  isSelectionMode: boolean;
  onClearSelection: () => void;
  onSelectAll: () => void;
  onDelete: () => void;
  onGenerateShoppingList: () => void;
  isDeleting?: boolean;
  className?: string;
}

const BatchActionToolbar: React.FC<BatchActionToolbarProps> = ({
  selectedCount,
  totalCount,
  isSelectionMode,
  onClearSelection,
  onSelectAll,
  onDelete,
  onGenerateShoppingList,
  isDeleting = false,
  className,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  if (!isSelectionMode) {
    return null;
  }

  const isAllSelected = selectedCount === totalCount && totalCount > 0;


  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border/60 rounded-lg shadow-sm p-3 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-96",
          className,
        )}
      >
        <div className="flex items-center justify-between w-full">
          {/* 左侧：全选按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="h-8 px-3 text-xs shrink-0"
          >
            {isAllSelected ? "取消全选" : "全选"}
          </Button>

          {/* 中间：主要操作按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateShoppingList}
              className="h-8 px-3 text-xs shrink-0"
              disabled={!onGenerateShoppingList || selectedCount === 0}
            >
              <span className="hidden sm:inline">生成购物清单</span>
              <span className="sm:hidden">购物清单</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={selectedCount === 0 || isDeleting}
              className="h-8 px-3 text-xs shrink-0 !text-white"
            >
              {isDeleting && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              {isDeleting ? "删除中..." : `删除${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
            </Button>
          </div>

          {/* 右侧：关闭按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 px-2 text-xs shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        title="确认删除"
        description={`确定要删除选中的 ${selectedCount} 个菜谱吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        confirmVariant="destructive"
      />
    </>
  );
};

export default BatchActionToolbar;
