import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/Button';

interface ExpandableCardProps {
  title: string;
  children: React.ReactNode;
  expandedContent: React.ReactNode;
  className?: string;
}

const ExpandableCard = ({
  title,
  children,
  expandedContent,
  className,
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    if (!isExpanded && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 设置动画的起始点
      document.documentElement.style.setProperty('--expand-center-x', `${centerX}px`);
      document.documentElement.style.setProperty('--expand-center-y', `${centerY}px`);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn("relative", className)} ref={cardRef}>
      <Card
        className={cn(
          "cursor-pointer transition-shadow hover:shadow-md",
          isExpanded && "shadow-md"
        )}
        onClick={handleExpand}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Maximize2 className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ 
              position: "fixed",
              top: "var(--expand-center-y)",
              left: "var(--expand-center-x)",
              width: 0,
              height: 0,
              scale: 0,
              opacity: 0,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{ 
              position: "fixed",
              top: "50%",
              left: "50%",
              width: "100vw",
              height: "calc(100vh - 4rem)",
              scale: 1,
              opacity: 1,
              borderRadius: 0,
              transform: "translate(-50%, -50%)",
            }}
            exit={{ 
              position: "fixed",
              top: "var(--expand-center-y)",
              left: "var(--expand-center-x)",
              width: 0,
              height: 0,
              scale: 0,
              opacity: 0,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="z-50 bg-background shadow-lg"
            style={{
              marginTop: "2rem"
            }}
          >
            <div className="h-full overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand();
                    }}
                  >
                    <Minimize2 className="h-5 w-5" />
                  </Button>
                </div>
                {expandedContent}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableCard; 
