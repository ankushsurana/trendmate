
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import CompanyCardSelect from "./CompanyCardSelect";

interface ComparisonSearchProps {
  symbol1: string;
  symbol2: string;
  isLoading: boolean;
  onSymbol1Change: (symbol: string) => void;
  onSymbol2Change: (symbol: string) => void;
  onCompare: () => void;
  onSwap: () => void;
  onReset: () => void;
  onCardSelect: (company: { label: string; value: string }, isFirstCompany: boolean) => void;
  showCards: boolean;
  companyOptions?: any;
  isFirstCompanySelected: boolean;
}

const ComparisonSearch = ({
  symbol1,
  symbol2,
  isLoading,
  onSymbol1Change,
  onSymbol2Change,
  onCompare,
  onSwap,
  onReset,
  onCardSelect,
  showCards,
  companyOptions,
  isFirstCompanySelected,
}: ComparisonSearchProps) => {
  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <div className="md:col-span-5">
            <div className="relative">
              <Input
                value={symbol1}
                onChange={(e) => onSymbol1Change(e.target.value)}
                placeholder="Enter first company name (e.g. Apple)"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-center md:col-span-1">
            <Button
              variant="outline"
              size="icon"
              onClick={onSwap}
              disabled={!symbol1 || !symbol2 || isLoading}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="md:col-span-5">
            <div className="relative">
              <Input
                value={symbol2}
                onChange={(e) => onSymbol2Change(e.target.value)}
                placeholder="Enter second company name (e.g. Microsoft)"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onCompare} 
            className="bg-trendmate-purple hover:bg-trendmate-purple-light px-8" 
            disabled={!symbol1 || !symbol2 || isLoading}
          >
            Compare Companies
          </Button>
        </div>

        {showCards && companyOptions && companyOptions.options && companyOptions.options.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              {isFirstCompanySelected ? "Select Second Company" : "Select First Company"}
            </h3>
            <CompanyCardSelect
              options={companyOptions.options}
              onSelect={(option) => onCardSelect(option, !isFirstCompanySelected)}
            />
          </div>
        )}

        {(symbol1 || symbol2) && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={onReset} disabled={isLoading}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Reset Comparison
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonSearch;
