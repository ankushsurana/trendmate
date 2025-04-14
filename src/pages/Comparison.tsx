
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import ComparisonCard from "@/components/StockComponents/ComparisonCard";
import StockChart from "@/components/StockComponents/StockChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Mock comparison data - in a real app, this would come from an API call
  const mockComparisonData = {
    metrics: [
      { title: "Current Price", value1: "$154.92", value2: "$187.65", winner: 2 as const },
      { title: "Market Cap", value1: "$2.45T", value2: "$1.87T", winner: 1 as const },
      { title: "P/E Ratio", value1: "25.6", value2: "32.8", winner: 1 as const },
      { title: "52-Week High", value1: "$198.23", value2: "$223.41", winner: 2 as const },
      { title: "52-Week Low", value1: "$124.17", value2: "$142.53", winner: 1 as const },
      { title: "Dividend Yield", value1: "0.59%", value2: "0.86%", winner: 2 as const },
    ],
  };

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

  // Check if both symbols are entered and show results
  const checkAndShowResults = (s1: string, s2: string) => {
    if (s1 && s2) {
      setShowResults(true);
      // In a real app, you would fetch comparison data here
      console.log(`Comparing stocks: ${s1} and ${s2}`);
    }
  };

  // Swap the two symbols
  const handleSwapSymbols = () => {
    const temp = symbol1;
    setSymbol1(symbol2);
    setSymbol2(temp);
  };

  // Clear the comparison
  const handleReset = () => {
    setSymbol1("");
    setSymbol2("");
    setShowResults(false);
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
                />
              </div>
              <div className="flex justify-center md:col-span-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapSymbols}
                  disabled={!symbol1 || !symbol2}
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
                />
              </div>
            </div>
            {showResults && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Reset Comparison
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!showResults ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter two stock symbols above to see side-by-side comparison
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StockChart symbol={symbol1} data={[]} />
              <StockChart symbol={symbol2} data={[]} />
            </div>

            <ComparisonCard
              symbol1={symbol1}
              symbol2={symbol2}
              metrics={mockComparisonData.metrics}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">{symbol1} Key Strengths</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li className="text-green-700">Higher market capitalization</li>
                    <li className="text-green-700">Lower P/E ratio (better value)</li>
                    <li className="text-green-700">Lower 52-week low (more stable price floor)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">{symbol2} Key Strengths</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li className="text-green-700">Higher current price</li>
                    <li className="text-green-700">Higher 52-week high (greater price potential)</li>
                    <li className="text-green-700">Higher dividend yield (better income)</li>
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
