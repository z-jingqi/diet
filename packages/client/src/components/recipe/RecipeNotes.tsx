import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from "lucide-react";
import { MutedText } from '@/components/ui/typography';

interface RecipeNotesProps {
  note: string;
}

const RecipeNotes = ({ note }: RecipeNotesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          饮食注意事项
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MutedText>{note}</MutedText>
      </CardContent>
    </Card>
  );
};

export default RecipeNotes; 
