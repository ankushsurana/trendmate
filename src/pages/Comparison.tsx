
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import ComparisonCard from "@/components/StockComponents/ComparisonCard";
import DynamicChart from "@/components/StockComponents/DynamicChart";
import MarkdownContent from "@/components/StockComponents/MarkdownContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useComparisonData } from "@/services/stockApi";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ChartData {
  type: string;
  data: any;
  options: any;
}

interface ReportItem {
  type: string;
  content?: string;
  chartLabel?: string;
  content?: string | ChartData;
}

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [comparisonQuery, setComparisonQuery] = useState("");
  const { data: apiData, isLoading, error } = useComparisonData(comparisonQuery);
  const { toast } = useToast();

  const handleSearch1 = (symbol: string) => {
    setSymbol1(symbol);
    checkAndShowResults(symbol, symbol2);
  };

  const handleSearch2 = (symbol: string) => {
    setSymbol2(symbol);
    checkAndShowResults(symbol1, symbol);
  };

  const checkAndShowResults = (s1: string, s2: string) => {
    if (s1 && s2) {
      const query = `${s1}, ${s2}`;
      setComparisonQuery(query);
      toast({
        description: `Comparing ${s1} with ${s2}...`,
        duration: 1500,
      });
    }
  };

  const handleSwapSymbols = () => {
    const temp = symbol1;
    setSymbol1(symbol2);
    setSymbol2(temp);
    if (symbol1 && symbol2) {
      setComparisonQuery(`${symbol2}, ${symbol1}`);
    }
  };

  const handleReset = () => {
    setSymbol1("");
    setSymbol2("");
    setComparisonQuery("");
  };
  
  // Render report data from the new format
  const renderReportData = () => {
    if (!apiData || !apiData.content || !apiData.content.reportData) {
      return null;
    }
    
    return apiData.content.reportData.map((item: ReportItem, index: number) => {
      if (item.type === "summary") {
        return (
          <div key={index} className="mb-6">
            <MarkdownContent content={item.content as string} />
          </div>
        );
      } else if (item.type === "chart" && item.content) {
        const chartData = item.content as ChartData;
        return (
          <div key={index} className="mb-6">
            <DynamicChart
              type={chartData.type}
              data={chartData.data}
              options={chartData.options}
              chartLabel={item.chartLabel || ""}
            />
          </div>
        );
      } else if (item.type === "table" && item.content) {
        // Handle table content
        return (
          <div key={index} className="mb-6">
            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: item.content as string }} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
      return null;
    });
  };

  // Handle legacy format from previous implementation
  const hasLegacyComparisonData = apiData &&
    apiData.content &&
    apiData.content.companies &&
    apiData.content.companies.length >= 2;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">Company Comparison</h1>

        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              <div className="md:col-span-5">
                <StockSearch
                  onSearch={handleSearch1}
                  placeholder="Enter first stock symbol (e.g. AAPL)"
                  buttonText="Set"
                  value={symbol1}
                  isLoading={isLoading}
                />
              </div>
              <div className="flex justify-center md:col-span-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapSymbols}
                  disabled={!symbol1 || !symbol2 || isLoading}
                  className="rounded-full"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="md:col-span-5">
                <StockSearch
                  onSearch={handleSearch2}
                  placeholder="Enter second stock symbol (e.g. MSFT)"
                  buttonText="Set"
                  value={symbol2}
                  isLoading={isLoading}
                />
              </div>
            </div>
            {comparisonQuery && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Reset Comparison
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!comparisonQuery ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter two stock symbols above to see side-by-side comparison
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">Loading comparison data...</div>
          </div>
        ) : error ? (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading comparison data. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <Alert variant="default" className="bg-amber-50 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              <AlertDescription className="text-amber-800">
                AI can assist, but always invest with caution — the market has a mind of its own.
              </AlertDescription>
            </Alert>

            {/* Handle new format */}
            {apiData?.content?.reportData ? (
              <div className="space-y-6">
                {renderReportData()}
              </div>
            ) : hasLegacyComparisonData ? (
              // Legacy format rendering
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apiData.content.companies.map((company, index) => (
                    <div key={index}>
                      <MarkdownContent 
                        content={company.summary} 
                        title={`${company.symbol} Company Summary`} 
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apiData.content.companies.map((company, index) => (
                    company.chart && (
                      <DynamicChart
                        key={index}
                        type={company.chart.type}
                        data={company.chart.data}
                        options={company.chart.options}
                        chartLabel={`${company.symbol} Stock Performance`}
                      />
                    )
                  ))}
                </div>

                {apiData.content.comparison && (
                  <ComparisonCard
                    symbol1={apiData.content.companies[0]?.symbol || symbol1}
                    symbol2={apiData.content.companies[1]?.symbol || symbol2}
                    metrics={apiData.content.comparison}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apiData.content.companies.map((company, index) => (
                    <Card key={index} className="dashboard-card">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-4">
                          {company.symbol} Key Strengths
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {company.strengths?.map((strength, idx) => (
                            <li key={idx} className="text-green-700">{strength}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-8 text-center py-16">
                <div className="text-trendmate-gray text-lg">
                  No comparison data available for the selected symbols.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Comparison;
