import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

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
          className={`ml-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"
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

const StockMetrics = ({ data }: StockMetricsProps) => {
  const stockData = {
    open: data?.open,
    high: data?.high,
    low: data?.low,
    close: data?.close,
    volume: data?.volume,
    change: data?.change ?? 2.09,
    changePercent: data?.changePercent ?? 1.37,
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
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Key Metrics</span>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-500">Open</div>
            <div className="text-2xl font-semibold">{formatPrice(stockData.open)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">High</div>
            <div className="text-2xl font-semibold">{formatPrice(stockData.high)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Low</div>
            <div className="text-2xl font-semibold">{formatPrice(stockData.low)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Close</div>
            <div className="text-2xl font-semibold">{formatPrice(stockData.close)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500">Volume</div>
            <div className="text-2xl font-semibold">{formatVolume(stockData.volume)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Change</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold">{formatPrice(Math.abs(stockData.change))}</span>
              <span className={`ml-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : "-"}{stockData.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockMetrics;
