import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import MarkdownContent from "./MarkdownContent";
import DynamicChart from "./DynamicChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        const cleanContent = item.content.replace(/<\/?[^>]+(>|$)/g, "");
        
        return (
          <Card key={index} className="mb-6 dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {index === 0 ? "Summary Analysis" : `Analysis ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownContent content={cleanContent} />
            </CardContent>
          </Card>
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
        const cleanedHtml = item.content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
          
        return (
          <div key={index} className="mb-6">
            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Comparison Data</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
      return null;
    });
  };
  
  const renderCompanyComparison = () => {
    if (!data?.content?.companies || data.content.companies.length < 2) {
      return null;
    }
    
    const [company1, company2] = data.content.companies;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>{company1.name} ({company1.symbol})</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
            <ul className="space-y-2">
              {Object.entries(company1.metrics).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">Summary</h3>
            <p className="text-sm text-gray-700">{company1.summary}</p>
            
            {company1.strengths?.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">Strengths</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {company1.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-gray-700">{strength}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>{company2.name} ({company2.symbol})</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
            <ul className="space-y-2">
              {Object.entries(company2.metrics).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">Summary</h3>
            <p className="text-sm text-gray-700">{company2.summary}</p>
            
            {company2.strengths?.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">Strengths</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {company2.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-gray-700">{strength}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderComparisonPoints = () => {
    if (!data?.content?.comparison?.length) {
      return null;
    }
    
    return (
      <Card className="mb-6 dashboard-card">
        <CardHeader>
          <CardTitle>Head-to-Head Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.content.comparison.map((item: any, index: number) => (
              <ComparisonCard
                key={index}
                title={item.title}
                value1={item.value1}
                value2={item.value2}
                symbol1={symbol1}
                symbol2={symbol2}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
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

      {renderCompanyComparison()}
      {renderComparisonPoints()}
      <div className="space-y-6">{renderReportData()}</div>
    </div>
  );
};

export default ComparisonReport;
