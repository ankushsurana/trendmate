
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from 'chart.js/auto';

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
  type: string;
  data: ChartData;
  options: ChartOptions;
  chartLabel: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ type, data, options, chartLabel }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: type as any,
          data: data,
          options: {
            ...options,
            maintainAspectRatio: false,
            responsive: true,
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{chartLabel}</span>
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
