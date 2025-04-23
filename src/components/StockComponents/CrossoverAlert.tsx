import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CrossoverAlertProps {
  symbol: string;
  alertType: string;
  condition: string;
  onDelete?: () => void;
}

const CrossoverAlert = ({
  symbol,
  alertType,
  condition,
  onDelete,
}: CrossoverAlertProps) => {
  return (
    <Card className="border-l-4 border-l-trendmate-blue dashboard-card animate-fade-in">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-trendmate-blue" />
          <CardTitle className="text-base">
            {symbol}{" "}
            <Badge variant="outline" className="ml-1">
              {alertType}
            </Badge>
          </CardTitle>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete alert</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-700">Condition: {condition}</p>
      </CardContent>
    </Card>
  );
};

export default CrossoverAlert;