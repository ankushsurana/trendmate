
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import ComparisonSearch from "@/components/StockComponents/ComparisonSearch";
import ComparisonReport from "@/components/StockComponents/ComparisonReport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCompanySearch, useCompanySelect } from "@/services/stockApi";
import { useToast } from "@/hooks/use-toast";

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [isFirstCompanySelected, setIsFirstCompanySelected] = useState(false);
  const [selectedSymbol1, setSelectedSymbol1] = useState("");
  const [selectedSymbol2, setSelectedSymbol2] = useState("");
  
  const { toast } = useToast();
  
  const { 
    data: companyOptions, 
    isLoading: isSearching,
    refetch: searchCompanies
  } = useCompanySearch(searchQuery);

  const {
    data: comparisonData,
    isLoading: isLoadingComparison,
    refetch: selectCompany
  } = useCompanySelect("");

  const handleSymbol1Change = (value: string) => {
    setSymbol1(value);
  };

  const handleSymbol2Change = (value: string) => {
    setSymbol2(value);
  };

  const handleCompare = async () => {
    const query = `${symbol1}, ${symbol2}`;
    setSearchQuery(query);
    setShowCards(true);
    setIsFirstCompanySelected(false);
    
    toast({
      description: "Searching for companies...",
      duration: 1500,
    });

    await searchCompanies();
  };

  const handleCardSelect = async (company: { label: string; value: string }, isFirstCompany: boolean) => {
    if (isFirstCompany) {
      setSelectedSymbol1(company.value);
      setIsFirstCompanySelected(true);
      
      // Call select-company-9826 API for first company
      await selectCompany();
      
      // After first company is selected, show cards for second company
      const query = `${symbol1}, ${symbol2}`;
      setSearchQuery(query);
      
      toast({
        description: `Selected ${company.label} as first company`,
        duration: 1500,
      });
    } else {
      setSelectedSymbol2(company.value);
      setShowCards(false);
      
      toast({
        description: `Selected ${company.label} as second company. Generating comparison...`,
        duration: 1500,
      });
    }
  };

  const handleSwapSymbols = () => {
    const tempSymbol = symbol1;
    setSymbol1(symbol2);
    setSymbol2(tempSymbol);
  };

  const handleReset = () => {
    setSymbol1("");
    setSymbol2("");
    setSearchQuery("");
    setShowCards(false);
    setIsFirstCompanySelected(false);
    setSelectedSymbol1("");
    setSelectedSymbol2("");
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
          isLoading={isSearching || isLoadingComparison}
          onSymbol1Change={handleSymbol1Change}
          onSymbol2Change={handleSymbol2Change}
          onCompare={handleCompare}
          onSwap={handleSwapSymbols}
          onReset={handleReset}
          onCardSelect={handleCardSelect}
          showCards={showCards}
          companyOptions={companyOptions}
          isFirstCompanySelected={isFirstCompanySelected}
        />

        {!showCards && !selectedSymbol1 && !selectedSymbol2 ? (
          <div className="mt-8 text-center py-16">
            <div className="text-trendmate-gray text-lg">
              Enter two company names above and click "Compare" to see side-by-side comparison
            </div>
          </div>
        ) : isSearching || isLoadingComparison ? (
          <div className="mt-8 text-center py-16">
            <Loader2 className="h-12 w-12 text-trendmate-purple animate-spin mx-auto mb-4" />
            <div className="text-trendmate-gray text-lg">
              Loading comparison data...
            </div>
          </div>
        ) : comparisonData ? (
          <ComparisonReport 
            data={comparisonData} 
            symbol1={selectedSymbol1} 
            symbol2={selectedSymbol2} 
          />
        ) : null}
      </div>
    </PageLayout>
  );
};

export default Comparison;
