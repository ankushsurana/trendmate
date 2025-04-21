
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompanyCardSelect from "@/components/StockComponents/CompanyCardSelect";
import { useToast } from "@/hooks/use-toast";
import ComparisonReport from "@/components/StockComponents/ComparisonReport";
import { useCompanySearchMutation, useCompanySelectMutation, CardSelectResponse } from "@/services/stockApi";
import { ArrowRight, Loader2 } from "lucide-react";

const Comparison = () => {
  const [company1, setCompany1] = useState("");
  const [company2, setCompany2] = useState("");
  const [selectedCompany1, setSelectedCompany1] = useState<string | null>(null);
  const [selectedCompany2, setSelectedCompany2] = useState<string | null>(null);
  const [companyOptions, setCompanyOptions] = useState<CardSelectResponse | null>(null);
  const [showFirstCompanyCards, setShowFirstCompanyCards] = useState(false);
  const [showSecondCompanyCards, setShowSecondCompanyCards] = useState(false);
  const [step, setStep] = useState(1);
  
  const toast = useToast();
  
  const companySearchMutation = useCompanySearchMutation();
  const companySelectMutation = useCompanySelectMutation();

  const handleCompare = async () => {
    if (!company1 || !company2) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both company names",
      });
      return;
    }

    try {
      const combinedQuery = `${company1}, ${company2}`;
      const data = await companySearchMutation.mutateAsync(combinedQuery);
      setCompanyOptions(data);
      setShowFirstCompanyCards(true);
      setStep(2);
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for companies. Please try again.",
      });
    }
  };

  const handleFirstCompanySelect = async (option: { label: string; value: string }) => {
    try {
      setSelectedCompany1(option.label);
      await companySelectMutation.mutateAsync(option.label);
      setShowFirstCompanyCards(false);
      setShowSecondCompanyCards(true);
      setStep(3);
      toast.toast({
        description: `Selected ${option.label} as first company`,
        duration: 1500,
      });
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select company. Please try again.",
      });
    }
  };

  const handleSecondCompanySelect = async (option: { label: string; value: string }) => {
    try {
      setSelectedCompany2(option.label);
      await companySelectMutation.mutateAsync(option.label);
      setShowSecondCompanyCards(false);
      setStep(4);
      toast.toast({
        description: `Comparison of ${selectedCompany1} and ${option.label} loaded`,
        duration: 1500,
      });
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select company. Please try again.",
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-trendmate-dark mb-8">Stock Comparison</h1>
        
        {step === 1 && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Companies to Compare</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Company</label>
                  <input
                    type="text"
                    value={company1}
                    onChange={(e) => setCompany1(e.target.value)}
                    placeholder="e.g. Apple"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trendmate-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Second Company</label>
                  <input
                    type="text"
                    value={company2}
                    onChange={(e) => setCompany2(e.target.value)}
                    placeholder="e.g. Microsoft"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trendmate-purple"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={handleCompare}
                  disabled={!company1 || !company2 || companySearchMutation.isPending}
                  className="bg-trendmate-purple hover:bg-trendmate-purple-light"
                >
                  {companySearchMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Compare</>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {showFirstCompanyCards && companyOptions && companyOptions.options && (
          <Card className="dashboard-card mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select First Company</h2>
              <CompanyCardSelect 
                options={companyOptions.options.filter(option => 
                  option.label.toLowerCase().includes(company1.toLowerCase()))}
                onSelect={handleFirstCompanySelect}
              />
            </CardContent>
          </Card>
        )}

        {showSecondCompanyCards && companyOptions && companyOptions.options && (
          <Card className="dashboard-card mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Select Second Company</h2>
              <CompanyCardSelect 
                options={companyOptions.options.filter(option => 
                  option.label.toLowerCase().includes(company2.toLowerCase()))}
                onSelect={handleSecondCompanySelect}
              />
            </CardContent>
          </Card>
        )}
        
        {step === 4 && selectedCompany1 && selectedCompany2 && (
          <>
            <div className="flex items-center justify-center mb-8">
              <h2 className="text-xl font-semibold">{selectedCompany1}</h2>
              <ArrowRight className="mx-4" />
              <h2 className="text-xl font-semibold">{selectedCompany2}</h2>
            </div>
            
            {companySelectMutation.isPending ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trendmate-purple"></div>
                <p className="mt-4 text-lg text-gray-600">Generating comparison...</p>
              </div>
            ) : companySelectMutation.data ? (
              <ComparisonReport data={companySelectMutation.data} />
            ) : null}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Comparison;
