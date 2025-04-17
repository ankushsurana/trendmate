
import { useQuery } from "@tanstack/react-query";
import { makeApiRequest } from "./apiConfig";
import { StockApiResponse, ComparisonApiResponse } from "./types";

// API function to fetch stock data
export const fetchStockData = async (companyName: string): Promise<StockApiResponse> => {
  return makeApiRequest("fetch-real-time-data-0202", companyName);
};

// API function to fetch comparison data
export const fetchComparisonData = async (companies: string): Promise<ComparisonApiResponse> => {
  return makeApiRequest("company-report-summarizer-0555", companies);
};

// Custom hook for stock data
export const useStockData = (companyName: string) => {
  return useQuery({
    queryKey: ['stockData', companyName],
    queryFn: () => fetchStockData(companyName),
    refetchOnWindowFocus: false,
    enabled: !!companyName,  // Only fetch when companyName is provided
  });
};

// Custom hook for comparison data
export const useComparisonData = (companies: string) => {
  return useQuery({
    queryKey: ['comparisonData', companies],
    queryFn: () => fetchComparisonData(companies),
    refetchOnWindowFocus: false,
    enabled: !!companies,  // Only fetch when companies is provided
  });
};
