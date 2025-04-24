import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDailyNotificationsQuery } from "@/services/stockApi";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const {
    data: dailyNotifications = [],
    isLoading: notifLoading,
    refetch: refetchNotifications,
  } = useDailyNotificationsQuery(notifMenuOpen);

  // Deduplicate notifications based on condition, description, and date
  const uniqueNotifications = useMemo(() => {
    const seen = new Set();
    return (dailyNotifications || []).filter(notification => {
      const key = `${notification.condition}-${notification.description}-${notification.date}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [dailyNotifications]);

  const hasNotification = uniqueNotifications.length > 0;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-trendmate-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-4.418 0-8 2.239-8 5v3a2 2 0 002 2h12a2 2 0 002-2v-3c0-2.761-3.582-5-8-5z" /></svg>
              <span className="ml-2 text-xl font-bold text-trendmate-dark">
                Trendmate
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple">Home</Link>
              <Link to="/analysis" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple">Analysis</Link>
              <Link to="/comparison" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple">Comparison</Link>
              <Link to="/notifications" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple">Alerts</Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <DropdownMenu
              open={notifMenuOpen}
              onOpenChange={(open) => {
                setNotifMenuOpen(open);
                if (open) refetchNotifications();
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full">
                  <Bell className="h-5 w-5" />
                  {hasNotification && (
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-trendmate-orange border-2 border-white"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-96 p-0 shadow-lg rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-trendmate-purple to-trendmate-purple-light p-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-md flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </h3>
                    {hasNotification && (
                      <span className="bg-white text-trendmate-purple text-xs font-bold px-2 py-1 rounded-full">
                        {uniqueNotifications.length} New
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifLoading ? (
                    <div className="p-6 flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-trendmate-purple"></div>
                      <p className="text-gray-500">Loading notifications...</p>
                    </div>
                  ) : hasNotification ? (
                    <div className="divide-y divide-gray-100">
                      {uniqueNotifications.slice(0, 8).map((n, idx) => (
                        <DropdownMenuItem
                          key={`${n.condition}-${n.date}-${idx}`}
                          className="flex flex-col gap-2 p-4 hover:bg-gray-50 focus:bg-gray-50"
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${n.condition.includes('Bearish') ? 'bg-red-50 text-red-600' :
                              n.condition.includes('Bullish') ? 'bg-green-50 text-green-600' :
                                'bg-blue-50 text-blue-600'
                              }`}>
                              {n.condition.includes('Bearish') ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${n.condition.includes('Bearish') ? 'bg-red-100 text-red-800' :
                                  n.condition.includes('Bullish') ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                  {n.condition}
                                </span>
                                <span className="text-xs text-gray-500">{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{n.description}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-gray-500">No notifications available.</p>
                    </div>
                  )}
                </div>


              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" className="ml-4 bg-trendmate-purple hover:bg-trendmate-purple-light">
              <Link to="/analysis" className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/analysis" className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Analysis</Link>
            <Link to="/comparison" className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Comparison</Link>
            <Link to="/notifications" className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Alerts</Link>
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