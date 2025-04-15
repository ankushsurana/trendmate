interface TaskInputs {
  rawQuery: string;
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

export const fetchStockData = async (companyName: string): Promise<StockApiResponse> => {
  try {
    const request: ApiRequest = {
      appId: "uptiq-interns",
      integrationId: "fetch-real-time-data-0202",
      taskInputs: {
        rawQuery: `${companyName} current stock price`
      }
    };

    console.log("Fetching data for:", companyName);
    console.log("Request payload:", request);
    
    // Simulating API delay - in production, replace with actual fetch call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = getMockResponse(companyName);
        resolve(mockResponse);
      }, 1000);
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

const getMockResponse = (companyName: string): StockApiResponse => {
  const upperCaseCompany = companyName.toUpperCase();
  
  return {
    content: {
      label: `Financial Health Report for ${companyName} (Ticker: ${upperCaseCompany})`,
      reportData: [
        {
          type: "summary",
          content: `**Company Information:**\n\n**${companyName}** (Ticker: **${upperCaseCompany}**)\n- **Market:** NASDAQ\n- **Sector:** ${upperCaseCompany === 'WMT' ? 'Consumer Discretionary' : 'Technology'}\n- **Last Refreshed:** April 15, 2025\n- **Time Zone:** US/Eastern`
        },
        {
          type: "chart",
          chartLabel: `Daily Closing Prices of ${upperCaseCompany}`,
          content: {
            type: "line",
            data: {
              labels: [
                "2025-01-17", "2025-01-21", "2025-01-22", "2025-01-23", "2025-01-24",
                "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-03-31",
                "2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04", "2025-04-07",
                "2025-04-08", "2025-04-09", "2025-04-10", "2025-04-11", "2025-04-14"
              ],
              datasets: [
                {
                  label: `${upperCaseCompany} Closing Price`,
                  data: [
                    91.94, 93.08, 93.23, 93.81, 99.54, 100.77, 102.46, 102.85, 101.15,
                    85.63, 85.15, 87.79, 88.83, 89.76, 87.26, 83.19, 83.83, 81.79, 89.6, 90.61
                  ],
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)"
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top"
                },
                title: {
                  display: true,
                  text: `${companyName} Daily Closing Prices`
                }
              }
            }
          }
        },
        {
          type: "summary",
          content: `**Stock Price Trend Analysis:**\n\n- Over the past months, ${upperCaseCompany}'s stock has shown **volatility**, with notable fluctuations ranging from a high of $104.00 to a low near $81.79.\n- The recent trend from April 1 to April 14 shows an **upward trajectory**, with the closing price increasing from $88.83 to $94.73.\n- **Volume** has been significant, particularly on April 9, when it reached over 46 million shares.`
        },
        {
          type: "chart",
          chartLabel: `Daily Trading Volume of ${upperCaseCompany}`,
          content: {
            type: "bar",
            data: {
              labels: [
                "2025-01-17", "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13",
                "2025-02-14", "2025-03-25", "2025-03-26", "2025-03-27", "2025-03-28",
                "2025-03-31", "2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04",
                "2025-04-07", "2025-04-08", "2025-04-09", "2025-04-10", "2025-04-11"
              ],
              datasets: [
                {
                  label: "Volume",
                  data: [
                    15868213, 23247451, 15567057, 14198438, 14973773, 18880614,
                    14641621, 11261444, 11012220, 16413893, 20484152, 15201194,
                    15926717, 13088467, 12451072, 15274644, 11953632, 15162125,
                    12604413, 14109460
                  ],
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)"
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top"
                },
                title: {
                  display: true,
                  text: `${companyName} Daily Trading Volume`
                }
              }
            }
          }
        },
        {
          type: "summary",
          content: `**Summary of Today's OHLCV Data (April 15, 2025):**\n\n- **Open Price:** $93.27\n- **High Price:** $95.44\n- **Low Price:** $92.90\n- **Close Price:** $94.73\n- **Volume:** 27,742,915`
        }
      ]
    }
  };
};
