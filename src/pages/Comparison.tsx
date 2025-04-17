
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import ComparisonSearch from "@/components/StockComponents/ComparisonSearch";
import ComparisonReport from "@/components/StockComponents/ComparisonReport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useComparisonData, useCompanySelect } from "@/services/stockApi";
import { useToast } from "@/hooks/use-toast";

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [comparisonQuery, setComparisonQuery] = useState("");
  
  const { data: apiData, isLoading: isLoadingComparison } = useComparisonData(comparisonQuery);
  const { refetch: selectCompany, isLoading: isSelectingCompany } = useCompanySelect("");
  
  const { toast } = useToast();
  
  const isLoading = isLoadingComparison || isSelectingCompany;

  const handleSearch1 = async (symbol: string) => {
    try {
      // First select the company
      await selectCompany();
      
      // Then set the symbol
      setSymbol1(symbol);
      checkAndShowResults(symbol, symbol2);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error selecting company. Please try again.",
        duration: 3000,
      });
    }
  };

  const handleSearch2 = async (symbol: string) => {
    try {
      // First select the company
      await selectCompany();
      
      // Then set the symbol
      setSymbol2(symbol);
      checkAndShowResults(symbol1, symbol);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error selecting company. Please try again.",
        duration: 3000,
      });
    }
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

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">
          Company Comparison
        </h1>

        <ComparisonSearch
          symbol1={symbol1}
          symbol2={symbol2}
          isLoading={isLoading}
          onSearch1={handleSearch1}
          onSearch2={handleSearch2}
          onSwap={handleSwapSymbols}
          onReset={handleReset}
        />

        {!comparisonQuery ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter two stock symbols above to see side-by-side comparison
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Loading comparison data...
            </div>
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
                Error loading comparison data. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Comparison;
