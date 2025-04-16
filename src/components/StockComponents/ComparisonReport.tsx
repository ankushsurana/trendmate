
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import DynamicChart from "./DynamicChart";
import { Card, CardContent } from "@/components/ui/card";
import ComparisonCard from "./ComparisonCard";

interface ReportProps {
  data: any;
  symbol1: string;
  symbol2: string;
}

const ComparisonReport = ({ data, symbol1, symbol2 }: ReportProps) => {
  const renderReportData = () => {
    if (!data?.content?.reportData) {
      return null;
    }
    
    return data.content.reportData.map((item: any, index: number) => {
      if (item.type === "summary") {
        return (
          <div key={index} className="mb-6">
            <MarkdownContent content={item.content} />
          </div>
        );
      } else if (item.type === "chart") {
        return (
          <div key={index} className="mb-6">
            <DynamicChart
              type={item.content.type}
              data={item.content.data}
              options={item.content.options}
              chartLabel={item.chartLabel || ""}
            />
          </div>
        );
      } else if (item.type === "table") {
        return (
          <div key={index} className="mb-6">
            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="mt-8 space-y-8">
      <Alert variant="default" className="bg-amber-50 border border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-700" />
        <AlertDescription className="text-amber-800">
          AI can assist, but always invest with caution — the market has a mind of its own.
        </AlertDescription>
      </Alert>

      {data?.content?.label && (
        <h2 className="text-2xl font-bold text-center my-6">{data.content.label}</h2>
      )}

      <div className="space-y-6">{renderReportData()}</div>
    </div>
  );
};

export default ComparisonReport;
