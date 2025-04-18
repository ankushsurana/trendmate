
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CompanyCardSelect from "./CompanyCardSelect";
import { useToast } from "@/hooks/use-toast";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  onCardSelect?: (option: { label: string; value: string }) => void;
  placeholder?: string;
  buttonText?: string;
  isLoading?: boolean;
  value?: string;
  showCards?: boolean;
  companyOptions?: any;
}

const StockSearch = ({
  onSearch,
  onCardSelect,
  placeholder = "Enter a company name (e.g. Walmart)",
  buttonText = "Analyze",
  isLoading = false,
  value = "",
  showCards = false,
  companyOptions = null
}: StockSearchProps) => {
  const [searchInput, setSearchInput] = useState(value);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleCardSelect = (option: { label: string; value: string }) => {
    if (onCardSelect) {
      onCardSelect(option);
      toast({
        description: `Selected ${option.label}`,
        duration: 1500,
      });
    }
  };

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
                disabled={isLoading}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={!searchInput.trim() || isLoading}
              className="bg-trendmate-purple hover:bg-trendmate-purple-light"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Loading..." : buttonText}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showCards && companyOptions && companyOptions.options && companyOptions.options.length > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <CompanyCardSelect
              options={companyOptions.options}
              onSelect={handleCardSelect}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StockSearch;
