
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface ComparisonItemProps {
  title: string;
  value1: string | number;
  value2: string | number;
  winner?: 1 | 2 | 0;
}

const ComparisonItem = ({ title, value1, value2, winner = 0 }: ComparisonItemProps) => {
  return (
    <div className="py-2">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="flex items-center">
          <span className="text-base font-medium">{value1}</span>
          {winner === 1 && (
            <ArrowUpRight className="ml-1 w-4 h-4 text-green-600" />
          )}
        </div>
        <div className="flex items-center">
          <span className="text-base font-medium">{value2}</span>
          {winner === 2 && (
            <ArrowUpRight className="ml-1 w-4 h-4 text-green-600" />
          )}
        </div>
      </div>
    </div>
  );
};

interface ComparisonCardProps {
  symbol1: string;
  symbol2: string;
  metrics: {
    title: string;
    value1: string | number;
    value2: string | number;
    winner?: 1 | 2 | 0;
  }[];
}

const ComparisonCard = ({ symbol1, symbol2, metrics }: ComparisonCardProps) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <div className="grid grid-cols-2 gap-2">
            <div>{symbol1}</div>
            <div>{symbol2}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="border-t pt-4">
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <ComparisonItem
              key={index}
              title={metric.title}
              value1={metric.value1}
              value2={metric.value2}
              winner={metric.winner}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonCard;
