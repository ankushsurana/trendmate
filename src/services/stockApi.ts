
import { useQuery } from "@tanstack/react-query";

// API configuration - ideally these would be in environment variables
const API_URL = "https://api-uptiq-dev.ciondigital.com/workflow-defs/run-sync";
const APP_ID = "uptiq-interns";
const WIDGET_KEY = "a6YkfZChaWHFiJcJBGjTLWJvETh0L17FJlyVJiI9";
const AGENT_ID = "trendmate-4009";

interface TaskInputs {
  query: string;
}

interface ApiRequest {
  appId: string;
  integrationId: string;
  taskInputs: TaskInputs;
}

interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartOptions {
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

interface ChartContent {
  type: string;
  data: ChartData;
  options: ChartOptions;
}

interface SummaryItem {
  type: "summary";
  content: string;
}

interface ChartItem {
  type: "chart";
  chartLabel: string;
  content: ChartContent;
}

interface TableItem {
  type: "table";
  content: string;
}

type ReportDataItem = SummaryItem | ChartItem | TableItem;

export interface StockApiResponse {
  content: {
    label: string;
    reportData: ReportDataItem[];
  };
}

interface ComparisonApiResponse {
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

interface AlertsApiResponse {
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

interface CardSelectResponse {
  options: Array<{
    label: string;
    value: string;
    subTitle: string;
  }>;
  type: "cardSelect";
  subTitleField: string;
}

const getApiHeaders = () => {
  return {
    'widgetKey': WIDGET_KEY,
    'appid': APP_ID,
    'agentId': AGENT_ID,
    'Content-Type': 'application/json'
  };
};

export const fetchStockData = async (companyName: string): Promise<StockApiResponse> => {
  try {
    const request: ApiRequest = {
      appId: APP_ID,
      integrationId: "fetch-real-time-data-0202",
      taskInputs: {
        query: `${companyName}`
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchComparisonData = async (companies: string): Promise<ComparisonApiResponse> => {
  try {
    const request: ApiRequest = {
      appId: APP_ID,
      integrationId: "company-report-summarizer-0555",
      taskInputs: {
        query: companies
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchAlertsData = async (): Promise<AlertsApiResponse> => {
  try {
    // Updated integration ID as requested
    const request: ApiRequest = {
      appId: "uptiq-interns",
      integrationId: "trigger-real-time-alerts-6475",
      taskInputs: {
        query: "latest stock alerts"
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching alerts data:", error);
    throw error;
  }
};

export const useStockData = (companyName: string) => {
  return useQuery({
    queryKey: ['stockData', companyName],
    queryFn: () => fetchStockData(companyName),
    refetchOnWindowFocus: false,
    enabled: !!companyName,  // Only fetch when companyName is provided
  });
};

export const useComparisonData = (companies: string) => {
  return useQuery({
    queryKey: ['comparisonData', companies],
    queryFn: () => fetchComparisonData(companies),
    refetchOnWindowFocus: false,
    enabled: !!companies,  // Only fetch when companies is provided
  });
};

export const useAlertsData = () => {
  return useQuery({
    queryKey: ['alertsData'],
    queryFn: fetchAlertsData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 1,  // Limit retries to avoid excessive API calls
  });
};

export const fetchCompanyOptions = async (query: string): Promise<CardSelectResponse> => {
  try {
    const request: ApiRequest = {
      appId: APP_ID,
      integrationId: "workflow-for-fetch-real-time-data-copy-1741346734879",
      taskInputs: {
        query
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching company options:", error);
    throw error;
  }
};

export const selectCompany = async (companyName: string): Promise<any> => {
  try {
    const request: ApiRequest = {
      appId: APP_ID,
      integrationId: "select-company-9826",
      taskInputs: {
        query: companyName
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error("Error selecting company:", error);
    throw error;
  }
};

export const useCompanySearch = (query: string) => {
  return useQuery({
    queryKey: ['companySearch', query],
    queryFn: () => fetchCompanyOptions(query),
    enabled: !!query && query.length >= 2,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,  // 1 minute
  });
};

export const useCompanySelect = (companyName: string) => {
  return useQuery({
    queryKey: ['companySelect', companyName],
    queryFn: () => selectCompany(companyName),
    enabled: false,  // Never automatically run this query
    refetchOnWindowFocus: false
  });
};
