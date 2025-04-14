
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart, Activity } from "lucide-react";

interface MetricProps {
  title: string;
  value: string | number;
  change?: string | number;
  isPositive?: boolean;
}

const Metric = ({ title, value, change, isPositive }: MetricProps) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{title}</span>
    <div className="flex items-baseline">
      <span className="text-2xl font-semibold">{value}</span>
      {change && (
        <span
          className={`ml-2 text-sm ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : "-"}
          {change}
        </span>
      )}
    </div>
  </div>
);

interface StockMetricsProps {
  symbol: string;
  data: {
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
    change?: number;
    changePercent?: number;
  };
}

const StockMetrics = ({ symbol, data }: StockMetricsProps) => {
  // Mock data if no data is provided
  const mockData = {
    open: 152.83,
    high: 155.41,
    low: 152.34,
    close: 154.92,
    volume: 45823900,
    change: 2.09,
    changePercent: 1.37,
  };

  const stockData = {
    open: data.open ?? mockData.open,
    high: data.high ?? mockData.high,
    low: data.low ?? mockData.low,
    close: data.close ?? mockData.close,
    volume: data.volume ?? mockData.volume,
    change: data.change ?? mockData.change,
    changePercent: data.changePercent ?? mockData.changePercent,
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatVolume = (vol: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(vol);

  const isPositive = stockData.change >= 0;

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">Key Metrics</span>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <Metric title="Open" value={formatPrice(stockData.open)} />
          <Metric title="High" value={formatPrice(stockData.high)} />
          <Metric title="Low" value={formatPrice(stockData.low)} />
          <Metric title="Close" value={formatPrice(stockData.close)} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <Metric title="Volume" value={formatVolume(stockData.volume)} />
          <Metric
            title="Change"
            value={formatPrice(stockData.change)}
            change={`${stockData.changePercent.toFixed(2)}%`}
            isPositive={isPositive}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockMetrics;
