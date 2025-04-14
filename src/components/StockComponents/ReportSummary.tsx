
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BarChart2 } from "lucide-react";

interface InsightItem {
  title: string;
  content: string;
  type: "positive" | "negative" | "neutral";
}

interface ReportSummaryProps {
  symbol: string;
  insights: InsightItem[];
  title?: string;
  icon?: React.ReactNode;
}

const ReportSummary = ({ 
  symbol, 
  insights, 
  title = "Trendmate AI Analysis", 
  icon = <BarChart2 className="mr-2 h-5 w-5 text-trendmate-purple" /> 
}: ReportSummaryProps) => {
  // Mock data if no insights are provided
  const mockInsights = [
    {
      title: "Strong Buy Signal",
      content:
        "The 20-day EMA has crossed above the 50-day EMA, indicating a potential bullish trend for the stock.",
      type: "positive",
    },
    {
      title: "Rising Volume",
      content:
        "Trading volume has increased by 25% compared to the 30-day average, suggesting growing investor interest.",
      type: "positive",
    },
    {
      title: "Resistance Level",
      content:
        "The stock is approaching a key resistance level at $162.50. Breaking through could signal further upside.",
      type: "neutral",
    },
  ];

  const reportInsights = insights && insights.length > 0 ? insights : mockInsights;

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {icon}
          {title} for {symbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                insight.type === "positive"
                  ? "bg-green-50 border-l-4 border-green-400"
                  : insight.type === "negative"
                  ? "bg-red-50 border-l-4 border-red-400"
                  : "bg-blue-50 border-l-4 border-blue-400"
              }`}
            >
              <div className="flex items-start">
                <Lightbulb
                  className={`mt-0.5 mr-2 h-5 w-5 ${
                    insight.type === "positive"
                      ? "text-green-600"
                      : insight.type === "negative"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                />
                <div>
                  <h4
                    className={`text-sm font-medium ${
                      insight.type === "positive"
                        ? "text-green-800"
                        : insight.type === "negative"
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {insight.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      insight.type === "positive"
                        ? "text-green-600"
                        : insight.type === "negative"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {insight.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummary;
