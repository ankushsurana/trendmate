import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CrossoverAlertProps {
  symbol: string;
  alertType: string;
  message: string;
  timestamp: string;
  isImportant?: boolean;
}

const CrossoverAlert = ({
  symbol,
  alertType,
  message,
  timestamp,
  isImportant = false,
}: CrossoverAlertProps) => {
  return (
    <Card
      className={`border-l-4 dashboard-card ${isImportant ? "border-l-trendmate-orange" : "border-l-trendmate-blue"
        } animate-fade-in`}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          {isImportant ? (
            <AlertTriangle className="h-5 w-5 text-trendmate-orange" />
          ) : (
            <Bell className="h-5 w-5 text-trendmate-blue" />
          )}
          <CardTitle className="text-base">
            {symbol}{" "}
            <Badge variant="outline" className="ml-1">
              {alertType}
            </Badge>
          </CardTitle>
        </div>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-700">{message}</p>
      </CardContent>
    </Card>
  );
};

export default CrossoverAlert;
