import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const API_URL = "https://api-uptiq-dev.ciondigital.com/workflow-defs/run-sync";
export const APP_ID = "uptiq-interns";
export const WIDGET_KEY = "a6YkfZChaWHFiJcJBGjTLWJvETh0L17FJlyVJiI9";
export const AGENT_ID = "trendmate-4009";

export interface TaskInputs {
  query: string | string[];
}

export interface ApiRequest {
  appId: string;
  integrationId: string;
  taskInputs: TaskInputs;
}

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

export const getApiHeaders = () => {
  return {
    'widgetKey': WIDGET_KEY,
    'appid': APP_ID,
    'agentId': AGENT_ID,
    'Content-Type': 'application/json'
  };
};

export async function makeApiRequest(integrationId: string, query: string | string[]) {
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

export const useCompanySearchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: string): Promise<CardSelectResponse> => {
      return makeApiRequest('workflow-for-fetch-real-time-data-copy-1741346734879', query);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['companySearch', variables], data);
    },
    onError: (error) => {
      console.error('Company search failed:', error);
      throw error;
    }
  });
};

export const useCompanySelectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyName: string[]): Promise<StockApiResponse> => {
      return makeApiRequest('select-company-9826', companyName);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['companySelect', variables], data);
    },
    onError: (error) => {
      console.error('Company selection failed:', error);
      throw error;
    }
  });
};

// export const useCompanyComparisonSearchMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (query: string): Promise<CardSelectResponse> => {
//       return makeApiRequest('workflow-for-fetch-real-time-data-copy-1741346734879', query);
//     },
//     onSuccess: (data, variables) => {
//       queryClient.setQueryData(['companySearch', variables], data);
//     },
//     onError: (error) => {
//       console.error('Company search failed:', error);
//       throw error;
//     }
//   });
// };

export const useCompanyComparisonSearchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: string): Promise<CardSelectResponse> => {
      return makeApiRequest('workflow-for-fetch-real-time-data-copy-1741346734879', query);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['companyComparisonSearch', variables], data);
    },
    onError: (error) => {
      console.error('Company comparison search failed:', error);
      throw error;
    }
  });
};

export const useComparisonSelectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companies: [string, string]): Promise<ComparisonApiResponse> => {
      return makeApiRequest('select-company-9826', companies);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['comparisonSelect', variables], data);
    },
    onError: (error) => {
      console.error('Company comparison selection failed:', error);
      throw error;
    }
  });
};

// Company select mutation hook
// export const useComparisonSelectMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (companyName: string): Promise<StockApiResponse> => {
//       return makeApiRequest('select-company-9826', companyName);
//     },
//     onSuccess: (data, variables) => {
//       queryClient.setQueryData(['companySelect', variables], data);
//     },
//     onError: (error) => {
//       console.error('Company selection failed:', error);
//       throw error;
//     }
//   });
// };



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
