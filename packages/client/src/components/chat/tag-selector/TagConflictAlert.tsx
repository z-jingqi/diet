import { AlertTriangle, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTagConflicts } from "@/hooks/useTagConflicts";

interface TagConflictAlertProps {
  selectedTags: any[];
  onClearConflicts?: () => void;
}

const TagConflictAlert = ({ selectedTags, onClearConflicts }: TagConflictAlertProps) => {
  const { getConflictMessages, hasMutualExclusiveConflicts, hasWarningConflicts } = useTagConflicts();

  const conflictMessages = getConflictMessages();

  if (conflictMessages.length === 0) {
    return null;
  }

  const hasErrors = hasMutualExclusiveConflicts();
  const hasWarnings = hasWarningConflicts();

  return (
    <div className="space-y-2">
      {conflictMessages.map((message, index) => (
        <Alert
          key={index}
          variant={message.type === "error" ? "destructive" : "default"}
          className={`${
            message.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : message.type === "warning"
              ? "border-yellow-200 bg-yellow-50 text-yellow-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          <div className="flex items-start gap-2">
            {message.type === "error" ? (
              <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : message.type === "warning" ? (
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <AlertDescription className="flex-1 text-sm">
              {message.message}
            </AlertDescription>
          </div>
        </Alert>
      ))}

      {hasErrors && onClearConflicts && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearConflicts}
            className="text-xs"
          >
            清除冲突标签
          </Button>
        </div>
      )}
    </div>
  );
};

export default TagConflictAlert; 