
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [symbol, setSymbol] = useState(value);
  
  useEffect(() => {
    // Update internal state if external value changes
    setSymbol(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim());
    }
  };

  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder={placeholder}
              className="pr-8"
              disabled={isLoading}
            />
            {symbol && (
              <button
                type="button"
                onClick={() => setSymbol("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={isLoading}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={!symbol.trim() || isLoading}
            className="bg-trendmate-purple hover:bg-trendmate-purple-light"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? "Loading..." : buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StockSearch;
