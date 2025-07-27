import React from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, X, Trash2, ListPlus, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background border rounded-lg shadow-lg p-3 sm:p-4 max-w-[calc(100vw-2rem)]",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* 全选按钮 */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="h-7 sm:h-8 px-2 text-xs"
            >
              {isAllSelected ? (
                <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              ) : (
                <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              )}
              {isAllSelected ? "取消全选" : "全选"}
            </Button>
          </div>

          {/* 批量操作按钮 */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateShoppingList}
              className="h-7 sm:h-8 text-xs flex-1 sm:flex-none"
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
              className="flex-1 sm:flex-none"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              删除 {selectedCount > 0 ? `(${selectedCount})` : ""}
            </Button>
          </div>

          {/* 关闭按钮 */}
          <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-7 sm:h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
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