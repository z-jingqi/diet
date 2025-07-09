import { createContext, useContext, useState, ReactNode } from "react";
import ConfirmDialog, {
  ConfirmDialogProps,
} from "@/components/ui/confirm-dialog";

export type ConfirmOptions = Omit<
  ConfirmDialogProps,
  "open" | "onOpenChange" | "onConfirm"
>;

// context类型：传递confirm方法
export type ConfirmDialogContextType = (
  options: ConfirmOptions
) => Promise<boolean>;

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

export const ConfirmDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [dialog, setDialog] = useState<
    ConfirmOptions & { resolve?: (v: boolean) => void; open: boolean }
  >({
    open: false,
  });

  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ ...options, open: true, resolve });
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDialog((d) => ({ ...d, open: false }));
      dialog.resolve?.(false);
    }
  };

  const handleConfirm = () => {
    setDialog((d) => ({ ...d, open: false }));
    dialog.resolve?.(true);
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={dialog.open}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        title={dialog.title}
        description={dialog.description}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        confirmVariant={dialog.confirmVariant}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx)
    throw new Error(
      "useConfirmDialog must be used within ConfirmDialogProvider"
    );
  return ctx;
};
