
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import StockMetrics from "@/components/StockComponents/StockMetrics";
import ReportSummary from "@/components/StockComponents/ReportSummary";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCompanySearchMutation, useCompanySelectMutation } from "@/services/stockApi";
import DynamicChart from "@/components/StockComponents/DynamicChart";
import MarkdownContent from "@/components/StockComponents/MarkdownContent";
import { useToast } from "@/hooks/use-toast";

const Analysis = () => {
  const [searchedSymbol, setSearchedSymbol] = useState("");
  const [companyOptions, setCompanyOptions] = useState<any>(null);
  const [showCards, setShowCards] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const { toast } = useToast();
  
  // Use mutation hooks
  const { 
    mutate: searchCompanies, 
    isLoading: isSearching,
  } = useCompanySearchMutation();

  const { 
    mutate: selectCompany, 
    isLoading: isSelectingCompany 
  } = useCompanySelectMutation();

  const extractOHLCVData = () => {
    if (!analysisData) return null;

    const ohlcvSummary = analysisData.content.reportData.find(
      (item) => item.type === "summary" && item.content.includes("OHLCV")
    );

    if (!ohlcvSummary || ohlcvSummary.type !== "summary") return null;

    // Remove HTML tags for reliable regex matching
    const content = ohlcvSummary.content.replace(/<\/?[^>]+(>|$)/g, "");

    const openMatch = content.match(/Open Price:\s*\$?([0-9.,]+)/);
    const highMatch = content.match(/High Price:\s*\$?([0-9.,]+)/);
    const lowMatch = content.match(/Low Price:\s*\$?([0-9.,]+)/);
    const closeMatch = content.match(/Close Price:\s*\$?([0-9.,]+)/);
    const volumeMatch = content.match(/Volume:\s*([0-9.,]+)/);

    if (!openMatch || !highMatch || !lowMatch || !closeMatch) return null;

    // Parse values, handling comma in numbers
    const parseValue = (value: string) => parseFloat(value.replace(/,/g, ''));

    return {
      symbol: searchedSymbol.toUpperCase(),
      price: parseValue(closeMatch[1]),
      change: 0,
      changePercent: 0,
      open: parseValue(openMatch[1]),
      high: parseValue(highMatch[1]),
      low: parseValue(lowMatch[1]),
      close: parseValue(closeMatch[1]),
      volume: volumeMatch ? parseValue(volumeMatch[1]) : 0,
    };
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setShowCards(true);
    setIsLoading(true);
    setIsError(false);
    
    toast({
      description: `Searching for ${query}...`,
      duration: 1500,
    });

    searchCompanies(query, {
      onSuccess: (data) => {
        setCompanyOptions(data);
        setIsLoading(false);
      },
      onError: (error) => {
        setIsError(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Error searching for companies. Please try again.",
          duration: 3000,
        });
      }
    });
  };

  const handleCardSelect = (company: { label: string; value: string }) => {
    setSearchedSymbol(company.value);
    setShowCards(false);
    setIsLoading(true);
    
    toast({
      description: `Analyzing ${company.label}...`,
      duration: 1500,
    });
    
    selectCompany(company.value, {
      onSuccess: (data) => {
        setAnalysisData(data);
        setIsLoading(false);
      },
      onError: (error) => {
        setIsError(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Error analyzing company. Please try again.",
          duration: 3000,
        });
      }
    });
  };

  const extractCompanySummary = () => {
    if (!analysisData || !analysisData.content || !analysisData.content.reportData) return [];

    const firstSummary = analysisData.content.reportData.find(item => item.type === "summary");

    if (!firstSummary || firstSummary.type !== "summary") return [];

    // Clean the content from HTML tags
    const cleanContent = firstSummary.content.replace(/<\/?[^>]+(>|$)/g, "");
    
    return [
      {
        title: "Company Overview",
        content: cleanContent,
      }
    ];
  };

  const stockData = extractOHLCVData();

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">Stock Analysis</h1>

        <StockSearch 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          value={searchedSymbol} 
          onCardSelect={handleCardSelect}
          showCards={showCards}
          companyOptions={companyOptions}
        />

        {!searchedSymbol && !showCards ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter a company name above to see detailed analysis
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-8 text-center py-16">
            <Loader2 className="h-12 w-12 text-trendmate-purple animate-spin mx-auto mb-4" />
            <div className="text-trendmate-gray text-lg">
              Loading analysis for {searchedSymbol || "company"}...
            </div>
          </div>
        ) : isError ? (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading stock data. Please try again with a different company.
              </AlertDescription>
            </Alert>
          </div>
        ) : analysisData ? (
          <div className="mt-8 space-y-8">
            <Alert variant="default" className="bg-amber-50 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              <AlertDescription className="text-amber-800">
                AI can assist, but always invest with caution — the market has a mind of its own.
              </AlertDescription>
            </Alert>

            <ReportSummary
              symbol={searchedSymbol}
              insights={extractCompanySummary()}
              title="Company Summary"
            />

            {analysisData.content.reportData.map((item, index) => {
              if (item.type === "chart") {
                return (
                  <DynamicChart
                    key={`chart-${index}`}
                    type={item.content.type}
                    data={item.content.data}
                    options={item.content.options}
                    chartLabel={item.chartLabel}
                  />
                );
              } else if (item.type === "summary" && index > 0) {
                // Clean HTML tags from content
                const cleanContent = item.content.replace(/<\/?[^>]+(>|$)/g, "");
                return (
                  <MarkdownContent
                    key={`summary-${index}`}
                    content={cleanContent}
                  />
                );
              }
              return null;
            })}

            {stockData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StockMetrics symbol={searchedSymbol} data={stockData} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
};

export default Analysis;
