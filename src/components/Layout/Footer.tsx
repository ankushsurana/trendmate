
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center">
              <TrendingUp className="h-8 w-8 text-trendmate-purple" />
              <span className="ml-2 text-xl font-bold text-trendmate-dark">
                Trendmate
              </span>
            </Link>
            <p className="mt-4 text-gray-500 max-w-md">
              Trendmate is your AI-powered stock market assistant, providing advanced analysis,
              trend detection, and actionable insights to help you make informed investment decisions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Features
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/analysis" className="text-gray-500 hover:text-trendmate-purple">
                  Stock Analysis
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="text-gray-500 hover:text-trendmate-purple">
                  Company Comparison
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-gray-500 hover:text-trendmate-purple">
                  Crossover Alerts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-trendmate-purple">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-trendmate-purple">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Trendmate. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-trendmate-purple">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-trendmate-purple">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
