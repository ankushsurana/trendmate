
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Bell,
//   Menu,
//   X,
//   TrendingUp,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link to="/" className="flex-shrink-0 flex items-center">
//               <TrendingUp className="h-8 w-8 text-trendmate-purple" />
//               <span className="ml-2 text-xl font-bold text-trendmate-dark">
//                 Trendmate
//               </span>
//             </Link>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               <Link
//                 to="/"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/analysis"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
//               >
//                 Analysis
//               </Link>
//               <Link
//                 to="/comparison"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
//               >
//                 Comparison
//               </Link>
//               <Link
//                 to="/notifications"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-trendmate-purple"
//               >
//                 Alerts
//               </Link>
//             </div>
//           </div>
//           <div className="hidden sm:flex sm:items-center">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative">
//                   <Bell className="h-5 w-5" />
//                   <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-trendmate-orange"></span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-80">
//                 <div className="p-4 font-medium">Notifications</div>
//                 <DropdownMenuItem>
//                   <div className="flex flex-col">
//                     <span className="font-medium">AAPL Crossover Signal</span>
//                     <span className="text-sm text-gray-500">EMA crossed SMA (20) upward</span>
//                   </div>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <div className="flex flex-col">
//                     <span className="font-medium">MSFT Volume Alert</span>
//                     <span className="text-sm text-gray-500">Unusual volume detected</span>
//                   </div>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <Button variant="default" className="ml-4 bg-trendmate-purple hover:bg-trendmate-purple-light">
//               Get Started
//             </Button>
//           </div>
//           <div className="flex items-center sm:hidden">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
//             >
//               {mobileMenuOpen ? (
//                 <X className="h-6 w-6" aria-hidden="true" />
//               ) : (
//                 <Menu className="h-6 w-6" aria-hidden="true" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//         <div className="sm:hidden">
//           <div className="pt-2 pb-3 space-y-1">
//             <Link
//               to="/"
//               className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               to="/analysis"
//               className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Analysis
//             </Link>
//             <Link
//               to="/comparison"
//               className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Comparison
//             </Link>
//             <Link
//               to="/notifications"
//               className="block pl-3 pr-4 py-2 text-base font-medium text-trendmate-dark hover:bg-gray-50"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Alerts
//             </Link>
//             <div className="pl-3 pr-4 py-3">
//               <Button className="w-full bg-trendmate-purple hover:bg-trendmate-purple-light">Get Started</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bell
} from "lucide-react";
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
  // Notification API fetch (fetches only when notif menu opens)
  const {
    data: dailyNotifications = [],
    isLoading: notifLoading,
    refetch: refetchNotifications,
  } = useDailyNotificationsQuery(notifMenuOpen);

  // orange dot if there are fetched notifications
  const hasNotification = !!(dailyNotifications && dailyNotifications.length > 0);

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
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {hasNotification && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-trendmate-orange"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 font-medium flex items-center gap-2">
                  Notifications
                </div>
                {notifLoading ? (
                  <DropdownMenuItem>
                    <span>Loading...</span>
                  </DropdownMenuItem>
                ) : (dailyNotifications && dailyNotifications.length > 0) ? (
                  dailyNotifications.slice(0, 6).map((n, idx) => (
                    <DropdownMenuItem key={idx} className="flex flex-col gap-1">
                      <span className="font-semibold">{n.condition}</span>
                      <span className="text-xs text-gray-700 whitespace-pre-line">{n.description}</span>
                      <span className="text-xs text-gray-400">{n.date}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>
                    <div className="text-gray-500 text-center w-full">No notifications</div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="w-full text-trendmate-purple text-xs text-center py-2">
                    View all notifications
                  </Link>
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
