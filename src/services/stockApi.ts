import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const API_URL = "https://api-uptiq-dev.ciondigital.com/workflow-defs/run-sync";
export const APP_ID = "uptiq-interns";
export const WIDGET_KEY = "a6YkfZChaWHFiJcJBGjTLWJvETh0L17FJlyVJiI9";
export const AGENT_ID = "trendmate-4009";


export const getApiHeaders = () => {
  return {
    'widgetKey': WIDGET_KEY,
    'appid': APP_ID,
    'agentId': AGENT_ID,
    'Content-Type': 'application/json'
  };
};


export interface TaskInputs {
  query: string | string[] | Record<string, any>;
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

export interface CardSelectResponse {
  options: Array<{
    label: string;
    value: string;
    subTitle: string;
  }>;
  type: "cardSelect";
  subTitleField: string;
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

export interface NotificationData {
  crossovers: Array<{
    date: string;
    signal: string;
    crossover: string;
    rsi: string;
    ema200: string;
    ema50: string;
    ohlcv: Record<string, string>;
  }>;
  message: string;
}

export interface AlertFormData {
  symbol: string;
  alertType: "MovingAverage" | "BollingerBands";
  condition: string;
}

export interface AlertItem {
  id: string;
  symbol: string;
  alertType: string;
  message: string;
  timestamp: string;
  isImportant?: boolean;
  condition?: string;
}

export interface AlertsApiResponse {
  content: {
    alerts: AlertItem[];
  };
}



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
      throw error;
    }
  });
};

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
      throw error;
    }
  });
};

export const useCreateAlertMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (alertData: AlertFormData): Promise<AlertItem> => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          appId: APP_ID,
          integrationId: 'alert-table-2938',
          taskInputs: {
            query: alertData
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create alert');
      }

      return {
        id: Date.now().toString(),
        symbol: alertData.symbol,
        alertType: alertData.alertType,
        message: `${alertData.alertType} alert for ${alertData.symbol}`,
        timestamp: new Date().toISOString(),
        condition: alertData.condition
      };
    },
    onSuccess: (newAlert) => {
      queryClient.setQueryData(['alertsData'], (oldData: AlertItem[] | undefined) => {
        return oldData ? [...oldData, newAlert] : [newAlert];
      });

      toast({
        title: "Success!",
        description: "Your alert has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create alert. Please try again.",
      });
    }
  });
};

export interface DailyNotificationItem {
  date: string;
  condition: string;
  description: string;
}

export const fetchDailyNotifications = async (): Promise<DailyNotificationItem[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        appId: APP_ID,
        integrationId: 'fetchdailynotification-5882',
        taskInputs: { query: "" }
      })
    });
    if (!response.ok) throw new Error('Failed to fetch daily notifications');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const useDailyNotificationsQuery = (enabled = false) => {
  // Use enabled to control fetch-on-click
  return useQuery({
    queryKey: ['dailyNotifications'],
    queryFn: fetchDailyNotifications,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};


export const fetchAlerts = async (): Promise<AlertItem[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        appId: APP_ID,
        integrationId: 'fetchalerts-from-table-4625',
        taskInputs: {
          query: ""
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const useAlertsDataQuery = () => {
  return useQuery({
    queryKey: ['alertsData'],
    queryFn: fetchAlerts,
    retry: false,

  });
}