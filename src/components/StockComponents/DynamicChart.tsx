import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartOptions {
  responsive?: boolean;
  plugins?: {
    legend?: {
      position?: string;
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: any;
}

interface DynamicChartProps {
  type?: string;
  data: ChartData | any;
  options?: ChartOptions;
  chartLabel?: string;
  symbol1?: string;
  symbol2?: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ type = 'line', data, options, chartLabel, symbol1, symbol2 }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const chartData = symbol1 && symbol2 ? {
          ...data?.content?.data,
          datasets: data?.content?.data?.datasets?.map((dataset: any) => ({
            ...dataset,
            fill: false
          }))
        } : data;

        const chartOptions = {
          ...options,
          ...(data?.content?.options || {}),
          maintainAspectRatio: false,
          responsive: true,
        };

        if (chartOptions?.scales?.x?.type === 'time') {
          chartOptions.scales = {
            ...chartOptions.scales,
            x: {
              ...chartOptions.scales.x,
              type: 'time',
              time: {
                ...chartOptions.scales.x.time,
                parser: 'yyyy-MM-dd',
                tooltipFormat: 'MMM d, yyyy',
              }
            }
          };
        }

        chartInstance.current = new Chart(ctx, {
          type: (symbol1 && symbol2) ? data?.content?.type || type : type,
          data: chartData,
          options: chartOptions
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options, symbol1, symbol2]);

  const displayLabel = symbol1 && symbol2
    ? `Price Comparison: ${symbol1} vs ${symbol2}`
    : chartLabel;

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{displayLabel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="h-full w-full">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicChart;