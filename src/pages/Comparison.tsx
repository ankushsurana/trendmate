
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import ComparisonSearch from "@/components/StockComponents/ComparisonSearch";
import ComparisonReport from "@/components/StockComponents/ComparisonReport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCompanySearchMutation, useCompanySelectMutation } from "@/services/stockApi";
import { useToast } from "@/hooks/use-toast";

const Comparison = () => {
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [isFirstCompanySelected, setIsFirstCompanySelected] = useState(false);
  const [selectedSymbol1, setSelectedSymbol1] = useState("");
  const [selectedSymbol2, setSelectedSymbol2] = useState("");
  const [companyOptions, setCompanyOptions] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  
  const { toast } = useToast();
  
  const { 
    mutate: searchCompanies, 
    isLoading: isSearching,
    isError: isSearchError
  } = useCompanySearchMutation();

  const {
    mutate: selectCompany,
    isLoading: isLoadingComparison,
    isError: isComparisonError
  } = useCompanySelectMutation();

  const handleSymbol1Change = (value: string) => {
    setSymbol1(value);
  };

  const handleSymbol2Change = (value: string) => {
    setSymbol2(value);
  };

  const handleCompare = async () => {
    if (!symbol1 || !symbol2) return;
    
    const query = `${symbol1}, ${symbol2}`;
    setShowCards(true);
    setIsFirstCompanySelected(false);
    
    toast({
      description: "Searching for companies...",
      duration: 1500,
    });

    searchCompanies(query, {
      onSuccess: (data) => {
        setCompanyOptions(data);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          description: "Error searching for companies. Please try again.",
          duration: 3000,
        });
        setShowCards(false);
      }
    });
  };

  const handleCardSelect = async (company: { label: string; value: string }, isFirstCompany: boolean) => {
    if (isFirstCompany) {
      setSelectedSymbol1(company.value);
      setIsFirstCompanySelected(true);
      
      toast({
        description: `Selected ${company.label} as first company`,
        duration: 1500,
      });
      
      // Call select-company-9826 API for first company
      selectCompany(company.value, {
        onSuccess: (data) => {
          // After first company is selected, show cards for second company
          // We don't need to set comparisonData yet as we need both companies
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            description: "Error selecting first company. Please try again.",
            duration: 3000,
          });
        }
      });
    } else {
      setSelectedSymbol2(company.value);
      setShowCards(false);
      
      toast({
        description: `Selected ${company.label} as second company. Generating comparison...`,
        duration: 1500,
      });
      
      // After selecting the second company, we'll get the full comparison data
      selectCompany(company.value, {
        onSuccess: (data) => {
          setComparisonData(data);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            description: "Error generating comparison. Please try again.",
            duration: 3000,
          });
        }
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
    setShowCards(false);
    setIsFirstCompanySelected(false);
    setSelectedSymbol1("");
    setSelectedSymbol2("");
    setCompanyOptions(null);
    setComparisonData(null);
  };

  const isLoading = isSearching || isLoadingComparison;
  const isError = isSearchError || isComparisonError;

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
        ) : isLoading ? (
          <div className="mt-8 text-center py-16">
            <Loader2 className="h-12 w-12 text-trendmate-purple animate-spin mx-auto mb-4" />
            <div className="text-trendmate-gray text-lg">
              Loading comparison data...
            </div>
          </div>
        ) : isError ? (
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading comparison data. Please try again with different companies.
              </AlertDescription>
            </Alert>
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
