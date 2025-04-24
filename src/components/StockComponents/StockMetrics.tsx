import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface MetricProps {
  title: string;
  value: string | number;
  change?: string | number;
  isPositive?: boolean;
  delay?: number;
}

const Metric = ({ title, value, change, isPositive, delay = 0 }: MetricProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
  >
    <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {change && (
        <div className="ml-2 flex items-center">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : "-"}{change}
          </span>
        </div>
      )}
    </div>
  </motion.div>
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
    <Card className="dashboard-card overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">Key Metrics</span>
            <span className="text-sm text-gray-500">({symbol})</span>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 0, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            {isPositive ? (
              <div className="flex items-center space-x-1">
                <Circle className="h-2 w-2 text-green-500 fill-green-500" />
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Circle className="h-2 w-2 text-red-500 fill-red-500" />
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            )}
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <Metric
            title="Open"
            value={formatPrice(stockData.open)}
            delay={0.1}
          />
          <Metric
            title="High"
            value={formatPrice(stockData.high)}
            delay={0.2}
          />
          <Metric
            title="Low"
            value={formatPrice(stockData.low)}
            delay={0.3}
          />
          <Metric
            title="Close"
            value={formatPrice(stockData.close)}
            delay={0.4}
          />
          <Metric
            title="Volume"
            value={formatVolume(stockData.volume)}
            delay={0.5}
          />
          <Metric
            title="Change"
            value={formatPrice(Math.abs(stockData.change))}
            change={`${stockData.changePercent.toFixed(2)}%`}
            isPositive={isPositive}
            delay={0.6}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockMetrics;
