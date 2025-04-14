
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Menu,
  X,
  TrendingUp,
  ActivitySquare,
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <TrendingUp className="h-8 w-8 text-trendmate-purple" />
              <span className="ml-2 text-xl font-bold text-trendmate-dark">
                Trendmate
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
              >
                Home
              </Link>
              <Link
                to="/analysis"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
              >
                Analysis
              </Link>
              <Link
                to="/comparison"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
              >
                Comparison
              </Link>
              <Link
                to="/notifications"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
              >
                Alerts
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-trendmate-orange"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 font-medium">Notifications</div>
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">AAPL Crossover Signal</span>
                    <span className="text-sm text-gray-500">EMA crossed SMA (20) upward</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span className="font-medium">MSFT Volume Alert</span>
                    <span className="text-sm text-gray-500">Unusual volume detected</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" className="ml-4 bg-trendmate-purple hover:bg-trendmate-purple-light">
              Get Started
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/analysis"
              className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analysis
            </Link>
            <Link
              to="/comparison"
              className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comparison
            </Link>
            <Link
              to="/notifications"
              className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Alerts
            </Link>
            <div className="pl-3 pr-4 py-3">
              <Button className="w-full bg-trendmate-purple hover:bg-trendmate-purple-light">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
