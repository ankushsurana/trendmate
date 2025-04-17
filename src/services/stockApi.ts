// Import dependencies
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API configuration
export const API_URL = "https://api-uptiq-dev.ciondigital.com/workflow-defs/run-sync";
export const APP_ID = "uptiq-interns";
export const WIDGET_KEY = "a6YkfZChaWHFiJcJBGjTLWJvETh0L17FJlyVJiI9";
export const AGENT_ID = "trendmate-4009";

export interface TaskInputs {
  query: string;
}

export interface ApiRequest {
  appId: string;
  integrationId: string;
  taskInputs: TaskInputs;
}

// Types
export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive: boolean;
  plugins: {
    legend: {
      position: string;
    };
    title: {
      display: boolean;
      text: string;
    };
  };
  scales?: any;
}

export interface ChartContent {
  type: string;
  data: ChartData;
  options: ChartOptions;
}

export interface SummaryItem {
  type: "summary";
  content: string;
}

export interface ChartItem {
  type: "chart";
  chartLabel: string;
  content: ChartContent;
}

export interface TableItem {
  type: "table";
  content: string;
}

export type ReportDataItem = SummaryItem | ChartItem | TableItem;

export interface StockApiResponse {
  content: {
    label: string;
    reportData: ReportDataItem[];
  };
}

export interface ComparisonApiResponse {
  content: {
    label?: string;
    reportData?: ReportDataItem[];
    companies?: Array<{
      name: string;
      symbol: string;
      metrics: Record<string, string | number>;
      summary: string;
      strengths: string[];
      chart: ChartContent;
    }>;
    comparison?: Array<{
      title: string;
      value1: string | number;
      value2: string | number;
    }>;
  };
}

export interface AlertsApiResponse {
  content: {
    alerts: Array<{
      symbol: string;
      alertType: string;
      message: string;
      timestamp: string;
      isImportant?: boolean;
    }>;
  };
}

export interface CardSelectResponse {
  options: Array<{
    label: string;
    value: string;
    subTitle: string;
  }>;
  type: "cardSelect";
  subTitleField: string;
}

export interface AlertFormData {
  symbol: string;
  alertType: string;
  condition: string;
}

// Integration IDs
const COMPANY_SEARCH_INTEGRATION_ID = "workflow-for-fetch-real-time-data-copy-1741346734879";
const COMPANY_SELECT_INTEGRATION_ID = "select-company-9826";
const ALERT_CREATE_INTEGRATION_ID = "alert-table-2938";

// Common API headers
export const getApiHeaders = () => {
  return {
    'widgetKey': WIDGET_KEY,
    'appid': APP_ID,
    'agentId': AGENT_ID,
    'Content-Type': 'application/json'
  };
};

// Common API request function to reduce code duplication
export async function makeApiRequest(integrationId: string, query: string) {
  try {
    const request: ApiRequest = {
      appId: APP_ID,
      integrationId,
      taskInputs: { query }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error making API request to ${integrationId}:`, error);
    throw error;
  }
}

// ===== COMPANY SEARCH API =====

// API function to fetch company options
export const fetchCompanyOptions = async (query: string): Promise<CardSelectResponse> => {
  return makeApiRequest('workflow-for-fetch-real-time-data-copy-1741346734879', query);
};

// API function to select a company
export const selectCompany = async (companyName: string): Promise<any> => {
  return makeApiRequest('select-company-9826', companyName);
};

// Custom hook for company search
export const useCompanySearch = (query: string) => {
  return useQuery({
    queryKey: ['companySearch', query],
    queryFn: () => fetchCompanyOptions(query),
    enabled: false, // Don't auto-fetch, we'll manually trigger with refetch
    refetchOnWindowFocus: false,
  });
};

// Custom hook for company selection
export const useCompanySelect = (companyName: string) => {
  return useQuery({
    queryKey: ['companySelect', companyName],
    queryFn: () => selectCompany(companyName),
    enabled: false, // Don't auto-fetch, we'll manually trigger with refetch
    refetchOnWindowFocus: false,
  });
};

// ===== STOCK DATA API =====

// API function to fetch stock data
export const fetchStockData = async (companyName: string): Promise<StockApiResponse> => {
  return makeApiRequest('select-company-9826', companyName);
};

// Custom hook for stock data
export const useStockData = (companyName: string) => {
  return useQuery({
    queryKey: ['stockData', companyName],
    queryFn: () => fetchStockData(companyName),
    refetchOnWindowFocus: false,
    enabled: !!companyName && companyName.length > 0,  // Only fetch when companyName is provided
  });
};

// ===== COMPARISON API =====

// API function to fetch comparison data
export const fetchComparisonData = async (companies: string): Promise<ComparisonApiResponse> => {
  return makeApiRequest('select-company-9826', companies);
};

// Custom hook for comparison data
export const useComparisonData = (companies: string) => {
  return useQuery({
    queryKey: ['comparisonData', companies],
    queryFn: () => fetchComparisonData(companies),
    refetchOnWindowFocus: false,
    enabled: !!companies && companies.length > 0,  // Only fetch when companies is provided
  });
};

// ===== ALERTS API =====

// API function to create a new alert
export const createAlert = async (alertData: AlertFormData): Promise<any> => {
  const query = `create alert for ${alertData.symbol} with ${alertData.alertType} ${alertData.condition}`;
  return makeApiRequest('alert-table-2938', query);
};

// Mock data for alerts since the real API is not working
const mockAlertData = {
  content: {
    alerts: [
      {
        symbol: "AAPL",
        alertType: "Moving Average",
        message: "Golden Cross detected on Apple Inc. The 50-day moving average crossed above the 200-day moving average.",
        timestamp: new Date().toISOString(),
        isImportant: true
      },
      {
        symbol: "MSFT",
        alertType: "Price Target",
        message: "Microsoft reached your price target of $350.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isImportant: false
      },
      {
        symbol: "TSLA",
        alertType: "Volatility",
        message: "Tesla's volatility has increased by 25% in the last week.",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isImportant: true
      }
    ]
  }
};

// API function to fetch alerts data
export const fetchAlertsData = async (): Promise<AlertsApiResponse> => {
  // Using mock data instead of API call to prevent errors
  return Promise.resolve(mockAlertData as AlertsApiResponse);
};

// API function to delete an alert
export const deleteAlert = async (alertId: string): Promise<any> => {
  // Using mock data instead of API call to prevent errors
  console.log("Deleting alert with ID:", alertId);
  return Promise.resolve({ success: true });
};

// Custom hook for alerts data
export const useAlertsData = () => {
  return useQuery({
    queryKey: ['alertsData'],
    queryFn: fetchAlertsData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 0,  // No retries to prevent excessive API calls
  });
};

// Custom hook for alert creation
export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      // Invalidate and refetch the alerts data
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
};

// Custom hook for alert deletion
export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
};
