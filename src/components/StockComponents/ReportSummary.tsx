
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface InsightItem {
  title: string;
  content: string;
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
  const cleanContent = (text: string): string =>
    text.replace(/<[^>]+>/g, "").replace(/[\*\#\n]/g, "").trim();

  const parseContent = (text: string): string[] =>
    text.split("<br><br>").map((paragraph) => cleanContent(paragraph));

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center font-semibold">
          {icon}
          {title} {symbol && `for ${symbol}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {insights.map((section, index) => (
            <div
              key={index}
              className="p-4 rounded-md bg-blue-50 border-l-4 border-blue-400 shadow-sm"
            >
              {/* Heading */}
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                {section.title}
              </h3>

              {/* Content */}
              <div className="text-base text-gray-700 space-y-4">
                {parseContent(section.content).map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export default ReportSummary;
