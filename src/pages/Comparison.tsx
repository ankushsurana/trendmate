
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import ComparisonCard from "@/components/StockComponents/ComparisonCard";
import StockChart from "@/components/StockComponents/StockChart";
import ReportSummary from "@/components/StockComponents/ReportSummary";
import DynamicChart from "@/components/StockComponents/DynamicChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useComparisonData } from "@/services/stockApi";
import { useToast } from "@/hooks/use-toast";

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [comparisonQuery, setComparisonQuery] = useState("");
  const { data: apiData, isLoading, error } = useComparisonData(comparisonQuery);
  const { toast } = useToast();

  // Handle search submission for first stock
  const handleSearch1 = (symbol: string) => {
    setSymbol1(symbol);
    checkAndShowResults(symbol, symbol2);
  };

  // Handle search submission for second stock
  const handleSearch2 = (symbol: string) => {
    setSymbol2(symbol);
    checkAndShowResults(symbol1, symbol);
  };

  // Check if both symbols are entered and fetch comparison data
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

  // Swap the two symbols
  const handleSwapSymbols = () => {
    const temp = symbol1;
    setSymbol1(symbol2);
    setSymbol2(temp);
    if (symbol1 && symbol2) {
      setComparisonQuery(`${symbol2}, ${symbol1}`);
    }
  };

  // Clear the comparison
  const handleReset = () => {
    setSymbol1("");
    setSymbol2("");
    setComparisonQuery("");
  };

  // Generate insight items from company summary
  const getCompanyInsights = (companyIndex: number) => {
    if (!apiData || !apiData.content || !apiData.content.companies || 
        apiData.content.companies.length <= companyIndex) {
      return [];
    }
    
    const company = apiData.content.companies[companyIndex];
    
    return [
      {
        title: "Company Overview",
        content: company.summary,
        type: "neutral" as const,
      }
    ];
  };
  
  // Extract strengths for a company
  const getCompanyStrengths = (companyIndex: number) => {
    if (!apiData || !apiData.content || !apiData.content.companies || 
        apiData.content.companies.length <= companyIndex) {
      return [];
    }
    
    return apiData.content.companies[companyIndex].strengths || [];
  };

  // Check if we have valid comparison data
  const hasComparisonData = apiData && 
                          apiData.content && 
                          apiData.content.companies && 
                          apiData.content.companies.length >= 2;

  // Create chart data
  const getChartData = (companyIndex: number) => {
    if (!hasComparisonData) {
      return null;
    }
    
    return apiData.content.companies[companyIndex].chart || null;
  };

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

        {!comparisonQuery || !hasComparisonData ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter two stock symbols above to see side-by-side comparison
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <Alert variant="default" className="bg-amber-50 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              <AlertDescription className="text-amber-800">
                AI can assist, but always invest with caution — the market has a mind of its own.
              </AlertDescription>
            </Alert>

            {/* First section: Company Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportSummary 
                symbol={apiData.content.companies[0]?.symbol || symbol1} 
                insights={getCompanyInsights(0)}
                title="Company Summary"
                icon={<FileText className="mr-2 h-5 w-5 text-trendmate-purple" />}
              />
              <ReportSummary 
                symbol={apiData.content.companies[1]?.symbol || symbol2} 
                insights={getCompanyInsights(1)}
                title="Company Summary"
                icon={<FileText className="mr-2 h-5 w-5 text-trendmate-purple" />}
              />
            </div>

            {/* Second section: Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getChartData(0) && (
                <DynamicChart
                  type={getChartData(0)!.type}
                  data={getChartData(0)!.data}
                  options={getChartData(0)!.options}
                  chartLabel={`${apiData.content.companies[0]?.symbol || symbol1} Stock Performance`}
                />
              )}
              {getChartData(1) && (
                <DynamicChart
                  type={getChartData(1)!.type}
                  data={getChartData(1)!.data}
                  options={getChartData(1)!.options}
                  chartLabel={`${apiData.content.companies[1]?.symbol || symbol2} Stock Performance`}
                />
              )}
            </div>

            {/* Third section: Comparison Metrics */}
            {apiData.content.comparison && (
              <ComparisonCard
                symbol1={apiData.content.companies[0]?.symbol || symbol1}
                symbol2={apiData.content.companies[1]?.symbol || symbol2}
                metrics={apiData.content.comparison}
              />
            )}

            {/* Fourth section: Key Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    {apiData.content.companies[0]?.symbol || symbol1} Key Strengths
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {getCompanyStrengths(0).map((strength, idx) => (
                      <li key={idx} className="text-green-700">{strength}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    {apiData.content.companies[1]?.symbol || symbol2} Key Strengths
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {getCompanyStrengths(1).map((strength, idx) => (
                      <li key={idx} className="text-green-700">{strength}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Comparison;
