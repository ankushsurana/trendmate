
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanySearch } from "@/services/stockApi";
import CompanyCardSelect from "./CompanyCardSelect";
import { useToast } from "@/hooks/use-toast";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  placeholder?: string;
  buttonText?: string;
  isLoading?: boolean;
  value?: string;
}

const StockSearch = ({
  onSearch,
  placeholder = "Enter a company name (e.g. Walmart)",
  buttonText = "Analyze",
  isLoading = false,
  value = "",
}: StockSearchProps) => {
  const [searchInput, setSearchInput] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCards, setShowCards] = useState(false);
  const { toast } = useToast();

  // Company search query - only runs when user submits search
  const { data: companyOptions, isLoading: isSearching } = useCompanySearch(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setShowCards(true);
      
      toast({
        description: `Searching for ${searchInput.trim()}...`,
        duration: 1500,
      });
    }
  };

  const handleCardSelect = (option: { label: string; value: string }) => {
    setShowCards(false);
    setSearchInput(option.value);
    
    toast({
      description: `Selected ${option.label}`,
      duration: 1500,
    });
    
    // Pass selected company to parent component for further processing
    onSearch(option.value);
  };

  // Combined loading state
  const combinedIsLoading = isLoading || isSearching;

  return (
    <>
      <Card className="dashboard-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={placeholder}
                className="pr-8"
                disabled={combinedIsLoading}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setShowCards(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={combinedIsLoading}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={!searchInput.trim() || combinedIsLoading}
              className="bg-trendmate-purple hover:bg-trendmate-purple-light"
            >
              <Search className="w-4 h-4 mr-2" />
              {combinedIsLoading ? "Loading..." : buttonText}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showCards && companyOptions && (
        <CompanyCardSelect
          options={companyOptions.options}
          onSelect={handleCardSelect}
        />
      )}
    </>
  );
};

export default StockSearch;
