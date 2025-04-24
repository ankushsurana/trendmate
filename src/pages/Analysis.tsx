import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import StockSearch from "@/components/StockComponents/StockSearch";
import StockMetrics from "@/components/StockComponents/StockMetrics";
import ReportSummary from "@/components/StockComponents/ReportSummary";
import { AlertCircle, Loader2, TrendingUp, PieChart, BarChart4 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCompanySearchMutation, useCompanySelectMutation } from "@/services/stockApi";
import DynamicChart from "@/components/StockComponents/DynamicChart";
import MarkdownContent from "@/components/StockComponents/MarkdownContent";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const Analysis = () => {
  const [searchedSymbol, setSearchedSymbol] = useState("");
  const [companyOptions, setCompanyOptions] = useState<any>(null);
  const [showCards, setShowCards] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { toast } = useToast();

  const {
    mutate: searchCompanies,
    isPending: isSearching,
  } = useCompanySearchMutation();

  const {
    mutate: selectCompany,
    isPending: isSelectingCompany
  } = useCompanySelectMutation();

  const extractOHLCVData = () => {
    if (!analysisData) return null;

    const ohlcvSummary = analysisData.content.reportData.find(
      (item) => item.type === "summary" && item.content.includes("OHLCV")
    );

    if (!ohlcvSummary || ohlcvSummary.type !== "summary") return null;

    const content = ohlcvSummary.content.replace(/<\/?[^>]+(>|$)/g, "");

    const openMatch = content.match(/Open Price:\s*\$?([0-9.,]+)/);
    const highMatch = content.match(/High Price:\s*\$?([0-9.,]+)/);
    const lowMatch = content.match(/Low Price:\s*\$?([0-9.,]+)/);
    const closeMatch = content.match(/Close Price:\s*\$?([0-9.,]+)/);
    const volumeMatch = content.match(/Volume:\s*([0-9.,]+)/);

    if (!openMatch || !highMatch || !lowMatch || !closeMatch) return null;

    const parseValue = (value: string) => parseFloat(value.replace(/,/g, ''));

    return {
      symbol: searchedSymbol.toUpperCase(),
      price: parseValue(closeMatch[1]),
      change: 0,
      changePercent: 0,
      open: parseValue(openMatch[1]),
      high: parseValue(highMatch[1]),
      low: parseValue(lowMatch[1]),
      close: parseValue(closeMatch[1]),
      volume: volumeMatch ? parseValue(volumeMatch[1]) : 0,
    };
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setShowCards(true);
    setIsLoading(true);
    setIsError(false);

    toast({
      description: `Searching for ${query}...`,
      duration: 1500,
    });

    searchCompanies(query, {
      onSuccess: (data) => {
        setCompanyOptions(data);
        setIsLoading(false);
      },
      onError: () => {
        setIsError(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Error searching for companies. Please try again.",
          duration: 3000,
        });
      }
    });
  };

  const handleCardSelect = (company: { label: string; value: string }) => {
    setSearchedSymbol(company.value);
    setShowCards(false);
    setIsLoading(true);

    toast({
      description: `Analyzing ${company.label}...`,
      duration: 1500,
    });

    selectCompany([company.value], {
      onSuccess: (data) => {
        setAnalysisData(data);
        setIsLoading(false);
      },
      onError: (error) => {
        setIsError(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Error analyzing company. Please try again.",
          duration: 3000,
        });
      }
    });
  };

  const extractCompanySummary = () => {
    if (!analysisData || !analysisData.content || !analysisData.content.reportData) return [];

    const firstSummary = analysisData.content.reportData.find(item => item.type === "summary");

    if (!firstSummary || firstSummary.type !== "summary") return [];

    const cleanContent = firstSummary.content.replace(/<\/?[^>]+(>|$)/g, "");

    return [
      {
        title: "Company Overview",
        content: cleanContent,
      }
    ];
  };

  const stockData = extractOHLCVData();

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Stock Analysis
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get comprehensive insights and analysis for any publicly traded company
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StockSearch
            onSearch={handleSearch}
            isLoading={isLoading}
            value={searchedSymbol}
            onCardSelect={handleCardSelect}
            showCards={showCards}
            companyOptions={companyOptions}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {!searchedSymbol && !showCards ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
                <CardContent className="pt-12 pb-12 text-center space-y-6">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-400" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-700">
                      Start Your Analysis
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Enter a company name or ticker symbol above to see detailed market analysis and insights
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 text-center py-16"
            >
              <div className="relative">
                <Loader2 className="h-16 w-16 text-purple-600 animate-spin mx-auto mb-6" />
                <div className="text-gray-600 text-lg">
                  Analyzing {searchedSymbol || "company"}...
                </div>
                <p className="text-gray-500 mt-2">
                  Gathering market data and generating insights
                </p>
              </div>
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base">
                  Error loading stock data. Please try again with a different company.
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : analysisData ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12 space-y-8"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Alert variant="default" className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                  <AlertDescription className="text-amber-800 font-medium">
                    AI can assist, but always invest with caution — the market has a mind of its own.
                  </AlertDescription>
                </Alert>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ReportSummary
                  symbol={searchedSymbol}
                  insights={extractCompanySummary()}
                  title="Company Summary"
                  icon={<PieChart className="mr-2 h-5 w-5 text-blue-600" />}
                />
              </motion.div>

              {analysisData.content.reportData.map((item, index) => {
                if (item.type === "chart") {
                  return (
                    <motion.div
                      key={`chart-${index}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <DynamicChart
                        type={item.content.type}
                        data={item.content.data}
                        options={item.content.options}
                        chartLabel={item.chartLabel}
                      />
                    </motion.div>
                  );
                } else if (item.type === "summary" && index > 0) {
                  const cleanContent = item.content.replace(/<\/?[^>]+(>|$)/g, "");
                  return (
                    <motion.div
                      key={`summary-${index}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <MarkdownContent content={cleanContent} />
                    </motion.div>
                  );
                }
                return null;
              })}

              {stockData && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <StockMetrics
                    symbol={searchedSymbol}
                    data={stockData}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </PageLayout>
  );
};

export default Analysis;
