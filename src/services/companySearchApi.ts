
import { useQuery } from "@tanstack/react-query";
import { makeApiRequest } from "./apiConfig";
import { CardSelectResponse } from "./types";

// API function to fetch company options
export const fetchCompanyOptions = async (query: string): Promise<CardSelectResponse> => {
  return makeApiRequest("workflow-for-fetch-real-time-data-copy-1741346734879", query);
};

// API function to select a company
export const selectCompany = async (companyName: string): Promise<any> => {
  return makeApiRequest("select-company-9826", companyName);
};

// Custom hook for company search - only enabled when query is typed
export const useCompanySearch = (query: string) => {
  return useQuery({
    queryKey: ['companySearch', query],
    queryFn: () => fetchCompanyOptions(query),
    enabled: !!query && query.length >= 2,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,  // 1 minute
  });
};

// Custom hook for company selection - never automatically run
export const useCompanySelect = (companyName: string) => {
  return useQuery({
    queryKey: ['companySelect', companyName],
    queryFn: () => selectCompany(companyName),
    enabled: false,  // Never automatically run this query
    refetchOnWindowFocus: false
  });
};
