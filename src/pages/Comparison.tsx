
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import ComparisonSearch from "@/components/StockComponents/ComparisonSearch";
import ComparisonReport from "@/components/StockComponents/ComparisonReport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useComparisonData } from "@/services/stockApi";
import { useToast } from "@/hooks/use-toast";

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [comparisonQuery, setComparisonQuery] = useState("");
  
  const { data: apiData, isLoading: isLoadingComparison, isError: isComparisonError } = useComparisonData(comparisonQuery);
  
  const { toast } = useToast();
  
  const handleSearch1 = (symbol: string) => {
    setSymbol1(symbol);
    
    toast({
      description: `Selected first company: ${symbol}`,
      duration: 1500,
    });
  };

  const handleSearch2 = (symbol: string) => {
    setSymbol2(symbol);
    
    toast({
      description: `Selected second company: ${symbol}`,
      duration: 1500,
    });
  };

  const handleCompare = () => {
    if (symbol1 && symbol2) {
      const query = `${symbol1}, ${symbol2}`;
      setComparisonQuery(query);
      
      toast({
        description: `Comparing ${symbol1} with ${symbol2}...`,
        duration: 1500,
      });
    }
  };

  const handleSwapSymbols = () => {
    const temp = symbol1;
    setSymbol1(symbol2);
    setSymbol2(temp);
  };

  const handleReset = () => {
    setSymbol1("");
    setSymbol2("");
    setComparisonQuery("");
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">
          Company Comparison
        </h1>

        <ComparisonSearch
          symbol1={symbol1}
          symbol2={symbol2}
          isLoading={isLoadingComparison}
          onSearch1={handleSearch1}
          onSearch2={handleSearch2}
          onCompare={handleCompare}
          onSwap={handleSwapSymbols}
          onReset={handleReset}
        />

        {!comparisonQuery ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter two stock symbols above and click "Compare" to see side-by-side comparison
            </div>
          </div>
        ) : isLoadingComparison ? (
          <div className="mt-8 text-center py-16">
            <Loader2 className="h-12 w-12 text-trendmate-purple animate-spin mx-auto mb-4" />
            <div className="text-trendmate-gray text-lg">
              Loading comparison data...
            </div>
          </div>
        ) : isComparisonError ? (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading comparison data. Please try different companies.
              </AlertDescription>
            </Alert>
          </div>
        ) : apiData ? (
          <ComparisonReport 
            data={apiData} 
            symbol1={symbol1} 
            symbol2={symbol2} 
          />
        ) : (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No comparison data available. Please try different companies.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Comparison;
