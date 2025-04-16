
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import StockSearch from "./StockSearch";

interface ComparisonSearchProps {
  symbol1: string;
  symbol2: string;
  isLoading: boolean;
  onSearch1: (symbol: string) => void;
  onSearch2: (symbol: string) => void;
  onSwap: () => void;
  onReset: () => void;
}

const ComparisonSearch = ({
  symbol1,
  symbol2,
  isLoading,
  onSearch1,
  onSearch2,
  onSwap,
  onReset,
}: ComparisonSearchProps) => {
  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <div className="md:col-span-5">
            <StockSearch
              onSearch={onSearch1}
              placeholder="Enter first stock symbol (e.g. AAPL)"
              buttonText="Set"
              value={symbol1}
              isLoading={isLoading}
            />
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
            <StockSearch
              onSearch={onSearch2}
              placeholder="Enter second stock symbol (e.g. MSFT)"
              buttonText="Set"
              value={symbol2}
              isLoading={isLoading}
            />
          </div>
        </div>
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
