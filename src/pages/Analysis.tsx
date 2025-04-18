
// Import necessary components and hooks
import React, { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanySearchMutation, useCompanySelectMutation, CardSelectResponse } from "@/services/stockApi";
import CompanyCardSelect from "@/components/StockComponents/CompanyCardSelect";
import { useToast } from "@/hooks/use-toast";
import ReportSummary from "@/components/StockComponents/ReportSummary";

const Analysis = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyOptions, setCompanyOptions] = useState<CardSelectResponse | null>(null);
  
  const toast = useToast();
  
  // Use mutations for API calls
  const companySearchMutation = useCompanySearchMutation();
  const companySelectMutation = useCompanySelectMutation();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const data = await companySearchMutation.mutateAsync(query);
      setCompanyOptions(data);
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for companies. Please try again.",
      });
    }
  };

  const handleCardSelect = async (option: { label: string; value: string }) => {
    try {
      setSelectedCompany(option.label);
      const data = await companySelectMutation.mutateAsync(option.label);
      toast.toast({
        description: `Analysis for ${option.label} loaded successfully.`,
        duration: 3000,
      });
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load company data. Please try again.",
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">Stock Analysis</h1>
        
        {/* Search Input */}
        <div className="mb-6">
          <StockSearch 
            onSearch={handleSearch}
            placeholder="Enter a company name (e.g. Walmart)"
            buttonText="Analyze"
            isLoading={companySearchMutation.isPending}
            value={searchQuery}
          />
        </div>
        
        {/* Company Selection */}
        {companyOptions && companyOptions.options && companyOptions.options.length > 0 && !selectedCompany && (
          <Card className="dashboard-card mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select Company</h2>
              <CompanyCardSelect 
                options={companyOptions.options} 
                onSelect={handleCardSelect} 
              />
            </CardContent>
          </Card>
        )}
        
        {/* Analysis Results */}
        {selectedCompany && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analysis for {selectedCompany}</h2>
            {companySelectMutation.isPending ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trendmate-purple"></div>
                <p className="mt-4 text-lg text-gray-600">Loading analysis...</p>
              </div>
            ) : companySelectMutation.data ? (
              <ReportSummary data={companySelectMutation.data} />
            ) : null}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Analysis;
