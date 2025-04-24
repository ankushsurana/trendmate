import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart2,
  ArrowRightCircle,
  LineChart,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <PageLayout>
      <section className="relative gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-trendmate-dark">
                Make <span className="text-trendmate-purple">Smarter</span> Investment Decisions
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                Trendmate is your AI-powered stock market assistant. Analyze trends, detect signals,
                and compare companies with cutting-edge technology to stay ahead in the market.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button className="bg-trendmate-purple hover:bg-trendmate-purple-light text-white" size="lg">
                  <Link to="/analysis" className="flex items-center">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div
                  className="rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                  style={{
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Stock market analysis dashboard"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-trendmate-purple text-white p-4 rounded-lg shadow-lg">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-trendmate-dark">
              Powerful Features for Smart Investors
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform gives you the tools to make informed investment decisions
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="stock-card">
              <CardContent className="p-8">
                <div className="bg-trendmate-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <LineChart className="h-6 w-6 text-trendmate-purple" />
                </div>
                <h3 className="text-xl font-bold text-trendmate-dark mb-3">Stock Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Get detailed stock analysis with interactive charts and AI-powered insights to understand market trends.
                </p>
                <Button variant="ghost" className="mt-auto text-trendmate-purple hover:text-trendmate-purple-light hover:bg-trendmate-purple/10 p-0">
                  <Link to="/analysis" className="flex items-center">
                    Analyze Stocks
                    <ArrowRightCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="stock-card">
              <CardContent className="p-8">
                <div className="bg-trendmate-blue/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <BarChart2 className="h-6 w-6 text-trendmate-blue" />
                </div>
                <h3 className="text-xl font-bold text-trendmate-dark mb-3">Company Comparison</h3>
                <p className="text-gray-600 mb-6">
                  Compare multiple companies side-by-side to identify the best investment opportunities in the market.
                </p>
                <Button variant="ghost" className="mt-auto text-trendmate-blue hover:text-trendmate-blue hover:bg-trendmate-blue/10 p-0">
                  <Link to="/comparison" className="flex items-center">
                    Compare Companies
                    <ArrowRightCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="stock-card">
              <CardContent className="p-8">
                <div className="bg-trendmate-orange/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <AlertTriangle className="h-6 w-6 text-trendmate-orange" />
                </div>
                <h3 className="text-xl font-bold text-trendmate-dark mb-3">Crossover Alerts</h3>
                <p className="text-gray-600 mb-6">
                  Get notified about important technical crossovers and market signals so you never miss an opportunity.
                </p>
                <Button variant="ghost" className="mt-auto text-trendmate-orange hover:text-trendmate-orange hover:bg-trendmate-orange/10 p-0">
                  <Link to="/notifications" className="flex items-center">
                    Setup Alerts
                    <ArrowRightCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-trendmate-dark">
              How Trendmate Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI engine analyzes market data to provide actionable insights
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                <span className="text-2xl font-bold text-trendmate-purple">1</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-trendmate-dark">Select Stock</h3>
              <p className="mt-2 text-sm text-gray-600">
                Enter the ticker symbol for any publicly traded company
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                <span className="text-2xl font-bold text-trendmate-purple">2</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-trendmate-dark">AI Analysis</h3>
              <p className="mt-2 text-sm text-gray-600">
                Our AI analyzes historical data, trends, and market indicators
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                <span className="text-2xl font-bold text-trendmate-purple">3</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-trendmate-dark">Generate Insights</h3>
              <p className="mt-2 text-sm text-gray-600">
                Review visual charts and actionable insights about the stock
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                <span className="text-2xl font-bold text-trendmate-purple">4</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-trendmate-dark">Take Action</h3>
              <p className="mt-2 text-sm text-gray-600">
                Make informed decisions based on reliable data and analysis
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
