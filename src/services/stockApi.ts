
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
  Alerts: {
    symbol: string;
    alertType: string;
    condition: string;
  };
}

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

// ===== COMPANY SEARCH API USING MUTATION =====

// Company search mutation hook
export const useCompanySearchMutation = () => {
  return useMutation({
    mutationFn: async (query: string): Promise<CardSelectResponse> => {
      return makeApiRequest('workflow-for-fetch-real-time-data-copy-1741346734879', query);
    }
  });
};

// Company select mutation hook
export const useCompanySelectMutation = () => {
  return useMutation({
    mutationFn: async (companyName: string): Promise<any> => {
      return makeApiRequest('select-company-9826', companyName);
    }
  });
};

// ===== ALERTS API =====

// API function to create a new alert with the correct format
export const useCreateAlertMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertData: AlertFormData): Promise<any> => {
      const query = JSON.stringify(alertData);
      return makeApiRequest('alert-table-2938', query);
    },
    onSuccess: () => {
      // Invalidate and refetch alerts data
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
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
export const useAlertsDataQuery = () => {
  return useQuery({
    queryKey: ['alertsData'],
    queryFn: async (): Promise<AlertsApiResponse> => {
      try {
        const response = await makeApiRequest('alert-table-2938', 'get-alerts');
        return response;
      } catch (error) {
        console.error('Error fetching alerts:', error);
        // Fall back to mock data for demo purposes
        return mockAlertData as AlertsApiResponse;
      }
    },
    staleTime: 60000 // 1 minute
  });
};

// API function to delete an alert
export const useDeleteAlertMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertId: string): Promise<any> => {
      const query = `delete-alert-${alertId}`;
      return makeApiRequest('alert-table-2938', query);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
};
