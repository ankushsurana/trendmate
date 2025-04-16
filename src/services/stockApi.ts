
import { useQuery } from "@tanstack/react-query";

// API URL and Headers
const API_URL = "https://api-uptiq-dev.ciondigital.com/workflow-defs/run-sync";

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

type ReportDataItem = SummaryItem | ChartItem;

export interface StockApiResponse {
  content: {
    label: string;
    reportData: ReportDataItem[];
  };
}

interface ComparisonApiResponse {
  content: {
    companies: Array<{
      name: string;
      symbol: string;
      metrics: Record<string, string | number>;
      summary: string;
      strengths: string[];
      chart: ChartContent;
    }>;
    comparison: Array<{
      title: string;
      value1: string | number;
      value2: string | number;
      winner?: 1 | 2 | 0;
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

const getApiHeaders = () => {
  return {
    'widgetKey': 'a6YkfZChaWHFiJcJBGjTLWJvETh0L17FJlyVJiI9',
    'appid': 'uptiq-interns',
    'Content-Type': 'application/json'
  };
};

export const fetchStockData = async (companyName: string): Promise<StockApiResponse> => {
  try {
    const request: ApiRequest = {
      appId: "uptiq-interns",
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
      appId: "uptiq-interns",
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
    const request: ApiRequest = {
      appId: "uptiq-interns",
      integrationId: "stock-alerts-generator-0333",
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

    throw error;
  }
};

export const useStockData = (companyName: string) => {
  return useQuery({
    queryKey: ['stockData', companyName],
    queryFn: () => fetchStockData(companyName),
    enabled: !!companyName,

  });
};

export const useComparisonData = (companies: string) => {
  return useQuery({
    queryKey: ['comparisonData', companies],
    queryFn: () => fetchComparisonData(companies),
    enabled: !!companies,

  });
};

export const useAlertsData = () => {
  return useQuery({
    queryKey: ['alertsData'],
    queryFn: fetchAlertsData,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 1
  });
};
