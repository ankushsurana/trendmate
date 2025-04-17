
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import StockMetrics from "@/components/StockComponents/StockMetrics";
import ReportSummary from "@/components/StockComponents/ReportSummary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCompanySelect } from "@/services/stockApi";
import DynamicChart from "@/components/StockComponents/DynamicChart";
import MarkdownContent from "@/components/StockComponents/MarkdownContent";
import { useToast } from "@/hooks/use-toast";

const Analysis = () => {
  const [searchedSymbol, setSearchedSymbol] = useState("");
  const { data: apiData, isLoading, error } = useCompanySelect(searchedSymbol);
  const { toast } = useToast();

  const extractOHLCVData = () => {
    if (!apiData) return null;

    const ohlcvSummary = apiData.content.reportData.find(
      (item) => item.type === "summary" && item.content.includes("OHLCV")
    );

    if (!ohlcvSummary || ohlcvSummary.type !== "summary") return null;

    const content = ohlcvSummary.content;

    const openMatch = content.match(/Open Price:\s*\$([0-9.]+)/);
    const highMatch = content.match(/High Price:\s*\$([0-9.]+)/);
    const lowMatch = content.match(/Low Price:\s*\$([0-9.]+)/);
    const closeMatch = content.match(/Close Price:\s*\$([0-9.]+)/);
    const volumeMatch = content.match(/Volume:\s*([0-9,]+)/);

    if (!openMatch || !highMatch || !lowMatch || !closeMatch) return null;

    return {
      symbol: searchedSymbol.toUpperCase(),
      price: parseFloat(closeMatch[1]),
      change: 0,
      changePercent: 0,
      open: parseFloat(openMatch[1]),
      high: parseFloat(highMatch[1]),
      low: parseFloat(lowMatch[1]),
      close: parseFloat(closeMatch[1]),
      volume: volumeMatch ? parseInt(volumeMatch[1].replace(/,/g, "")) : 0,
    };
  };

  const handleSearch = async (symbol: string) => {
    if (!symbol.trim()) return;
    setSearchedSymbol(symbol);

    toast({
      description: `Fetching data for ${symbol}...`,
      duration: 1500,
    });
  };

  const extractCompanySummary = () => {
    if (!apiData || !apiData.content || !apiData.content.reportData) return [];

    const firstSummary = apiData.content.reportData.find(item => item.type === "summary");

    if (!firstSummary || firstSummary.type !== "summary") return [];

    return [
      {
        title: "Company Overview",
        content: firstSummary.content,
      }
    ];
  };

  const stockData = extractOHLCVData();


  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">Stock Analysis</h1>

        <StockSearch onSearch={handleSearch} isLoading={isLoading} />

        {!apiData ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter a company name above to see detailed analysis
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

            <ReportSummary
              symbol={searchedSymbol}
              insights={extractCompanySummary()}
              title="Company Summary"
            />

            {apiData.content.reportData.map((item, index) => {
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
                return (
                  <MarkdownContent
                    key={`summary-${index}`}
                    content={item.content}
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
        )}
      </div>
    </PageLayout>
  );
};

export default Analysis;
