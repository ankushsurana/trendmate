
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import StockChart from "@/components/StockComponents/StockChart";
import StockMetrics from "@/components/StockComponents/StockMetrics";
import ReportSummary from "@/components/StockComponents/ReportSummary";
import CrossoverAlert from "@/components/StockComponents/CrossoverAlert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Analysis = () => {
  const [searchedSymbol, setSearchedSymbol] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Mock stock data - in a real app, this would come from an API call
  const mockStockData = {
    symbol: "AAPL",
    price: 154.92,
    change: 2.09,
    changePercent: 1.37,
    open: 152.83,
    high: 155.41,
    low: 152.34,
    close: 154.92,
    volume: 45823900,
  };

  // Mock insights
  const mockInsights = [
    {
      title: "Strong Buy Signal",
      content:
        "The 20-day EMA has crossed above the 50-day EMA, indicating a potential bullish trend for the stock.",
      type: "positive" as const,
    },
    {
      title: "Rising Volume",
      content:
        "Trading volume has increased by 25% compared to the 30-day average, suggesting growing investor interest.",
      type: "positive" as const,
    },
    {
      title: "Resistance Level",
      content:
        "The stock is approaching a key resistance level at $162.50. Breaking through could signal further upside.",
      type: "neutral" as const,
    },
  ];

  // Handle search submission
  const handleSearch = (symbol: string) => {
    setSearchedSymbol(symbol);
    setShowResults(true);
    // In a real app, you would fetch data here
    console.log(`Searching for stock: ${symbol}`);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">Stock Analysis</h1>

        <StockSearch onSearch={handleSearch} />

        {!showResults ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter a stock symbol above to see detailed analysis
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
            
            {/* First section: Report Summary */}
            <ReportSummary symbol={searchedSymbol} insights={mockInsights} />
            
            {/* Second section: Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <StockChart
                  symbol={searchedSymbol}
                  data={[]} // In a real app, this would be actual chart data
                />
              </div>
              <div>
                <StockMetrics symbol={searchedSymbol} data={mockStockData} />
              </div>
            </div>

            {/* Third section: Signals */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Signals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CrossoverAlert
                  symbol={searchedSymbol}
                  alertType="MA Crossover"
                  message="20-day EMA crossed above 50-day EMA, indicating a bullish signal."
                  timestamp="2 hours ago"
                  isImportant={true}
                />
                <CrossoverAlert
                  symbol={searchedSymbol}
                  alertType="Volume Alert"
                  message="Trading volume is 25% higher than the 30-day average."
                  timestamp="1 day ago"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Analysis;
