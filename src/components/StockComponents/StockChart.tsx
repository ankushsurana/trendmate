
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface StockChartProps {
  data: any[];
  symbol: string;
}

const StockChart = ({ data, symbol }: StockChartProps) => {
  const [chartType, setChartType] = useState("line");

  // Mock data for demonstration if no data is provided
  const mockData = [
    { date: "2023-01", price: 150, volume: 1200000 },
    { date: "2023-02", price: 155, volume: 1500000 },
    { date: "2023-03", price: 140, volume: 1800000 },
    { date: "2023-04", price: 160, volume: 1300000 },
    { date: "2023-05", price: 180, volume: 2000000 },
    { date: "2023-06", price: 185, volume: 1700000 },
    { date: "2023-07", price: 190, volume: 1900000 },
    { date: "2023-08", price: 195, volume: 2100000 },
    { date: "2023-09", price: 185, volume: 1800000 },
    { date: "2023-10", price: 205, volume: 2500000 },
    { date: "2023-11", price: 210, volume: 2200000 },
    { date: "2023-12", price: 225, volume: 2700000 },
  ];

  const chartData = data && data.length > 0 ? data : mockData;

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{symbol} Stock Performance</span>
          <Tabs defaultValue="line" className="w-auto" onValueChange={setChartType}>
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="line" className="text-xs">Line</TabsTrigger>
              <TabsTrigger value="area" className="text-xs">Area</TabsTrigger>
              <TabsTrigger value="candlestick" className="text-xs">Volume</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "line" ? (
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#0ea5e9" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
