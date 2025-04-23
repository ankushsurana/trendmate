// stockAPI

import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const API_URL = "https://api-uptiq-dev.ciondigital.com/workflow-defs/run-sync";
export const APP_ID = "uptiq-interns";
export const WIDGET_KEY = "a6YkfZChaWHFiJcJBGjTLWJvETh0L17FJlyVJiI9";
export const AGENT_ID = "trendmate-4009";

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

export const useCreateAlertMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (alertData: AlertFormData): Promise<any> => {

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

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['alertsData'], (oldData: AlertsApiResponse | undefined) => {
        if (!oldData) return oldData;

        return {
          content: {
            alerts: [
              ...oldData.content.alerts,
              {
                id: Date.now().toString(),
                symbol: data.symbol,
                alertType: data.alertType,
                message: `${data.alertType} alert for ${data.symbol}`,
                timestamp: new Date().toISOString(),
                condition: data.condition
              }
            ]
          }
        };
      });

      toast({
        title: "Alert created",
        description: "Your alert has been successfully created.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create alert. Please try again.",
      });
    }
  });
};

export const fetchNotificationData = async (): Promise<{ [key: string]: NotificationData }> => {
  try {
    const apis = [
      // { key: "predict", id: "predict-stock-movement-6475" },
      // { key: "bollinger", id: "analyze-bollinger-bands-1802" },
    ];

    const requestFor = async (integrationId: string) => {
      try {
        const request: ApiRequest = {
          appId: APP_ID,
          integrationId,
          taskInputs: { query: "" }
        };

        const response = await fetch(API_URL, {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          console.error(`Failed to fetch notifications from ${integrationId}: ${response.status}`);
          return { content: {} };
        }

        return await response.json();
      } catch (error) {
        console.error(`Error fetching from ${integrationId}:`, error);
        return { content: {} };
      }
    };

    const results = await Promise.all(
      apis.map(async (api) => {
        const resp = await requestFor(api.id);
        return [api.key, resp?.content || {}];
      })
    );

    return Object.fromEntries(results);
  } catch (error) {
    console.error("Error fetching notification data:", error);
    return {};
  }
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
    console.error("Error fetching daily notifications:", error);
    return [];
  }
};

export const useDailyNotificationsQuery = (enabled = false) => {
  // Use enabled to control fetch-on-click
  return useQuery({
    queryKey: ['dailyNotifications'],
    queryFn: fetchDailyNotifications,
    enabled, // Not fetching on mount, only when triggered by user
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
    return data || [];
  } catch (error) {
    console.error("Error fetching alerts:", error);
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

export const useNotificationDataQuery = () => {
  return useQuery({
    queryKey: ['notificationData'],
    queryFn: fetchNotificationData,
    refetchOnWindowFocus: false,
  });
};


export const useDeleteAlertMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (alertId: string): Promise<any> => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          appId: APP_ID,
          integrationId: 'alert-table-2938',
          taskInputs: {
            query: JSON.stringify(alertId)
          }
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        throw new Error(errorData?.message || `Failed to delete alert`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
      toast({
        title: "Alert deleted",
        description: "Your alert has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete alert. Please try again.",
      });
    }
  });
};