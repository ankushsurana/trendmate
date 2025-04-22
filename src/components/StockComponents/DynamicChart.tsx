
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

import { LinearScale, TimeScale } from 'chart.js';
Chart.register(LinearScale, TimeScale);

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
        // Ensure time scale is properly configured
        const chartOptions = {
          ...options,
          maintainAspectRatio: false,
          responsive: true,
        };

        // If it's a time scale, make sure the adapter is properly set
        if (options?.scales?.x?.type === 'time') {
          chartOptions.scales = {
            ...chartOptions.scales,
            x: {
              ...options.scales.x,
              type: 'time',
              time: {
                ...options.scales.x.time,
                parser: 'yyyy-MM-dd',
                tooltipFormat: 'MMM d, yyyy',
              }
            }
          };
        }

        chartInstance.current = new Chart(ctx, {
          type: type as any,
          data: data,
          options: chartOptions
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