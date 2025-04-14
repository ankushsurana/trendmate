
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import CrossoverAlert from "@/components/StockComponents/CrossoverAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, Bell } from "lucide-react";
import { toast } from "sonner";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newAlertSymbol, setNewAlertSymbol] = useState("");

  // Mock alerts - in a real app, these would come from an API
  const mockAlerts = [
    {
      id: 1,
      symbol: "AAPL",
      alertType: "MA Crossover",
      message: "20-day EMA crossed above 50-day EMA, indicating a bullish signal.",
      timestamp: "2 hours ago",
      isImportant: true,
    },
    {
      id: 2,
      symbol: "MSFT",
      alertType: "Volume Alert",
      message: "Trading volume is 25% higher than the 30-day average.",
      timestamp: "4 hours ago",
      isImportant: false,
    },
    {
      id: 3,
      symbol: "TSLA",
      alertType: "RSI Alert",
      message: "RSI has dropped below 30, indicating the stock may be oversold.",
      timestamp: "Yesterday",
      isImportant: true,
    },
    {
      id: 4,
      symbol: "AMZN",
      alertType: "Support Level",
      message: "Price is approaching a key support level at $135.25.",
      timestamp: "2 days ago",
      isImportant: false,
    },
  ];

  // Mock subscribed alerts
  const mockSubscriptions = [
    {
      id: 101,
      symbol: "AAPL",
      type: "MA Crossover",
      condition: "When 20-day EMA crosses 50-day EMA",
      active: true,
    },
    {
      id: 102,
      symbol: "GOOGL",
      type: "Volume Alert",
      condition: "When volume exceeds 30-day average by 20%",
      active: true,
    },
    {
      id: 103,
      symbol: "MSFT",
      type: "RSI Alert",
      condition: "When RSI drops below 30 or rises above 70",
      active: false,
    },
  ];

  // Handle subscribing to a new alert
  const handleSubscribe = () => {
    if (newAlertSymbol.trim()) {
      toast.success(`Alert for ${newAlertSymbol.toUpperCase()} created successfully`);
      setNewAlertSymbol("");
    } else {
      toast.error("Please enter a valid stock symbol");
    }
  };

  // Toggle subscription status
  const toggleSubscription = (id: number) => {
    // In a real app, this would update the subscription status in your backend
    toast.success("Subscription status updated");
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-trendmate-dark">Notifications & Alerts</h1>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <Label htmlFor="email-notifications">Email Alerts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
              <Label htmlFor="push-notifications">Push Alerts</Label>
            </div>
          </div>
        </div>

        <Tabs defaultValue="recent" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="recent">Recent Alerts</TabsTrigger>
            <TabsTrigger value="subscriptions">Your Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAlerts.map((alert) => (
                <CrossoverAlert
                  key={alert.id}
                  symbol={alert.symbol}
                  alertType={alert.alertType}
                  message={alert.message}
                  timestamp={alert.timestamp}
                  isImportant={alert.isImportant}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Alert Subscriptions</CardTitle>
                <CardDescription>
                  Get notified when specific market events occur for your selected stocks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-trendmate-dark">
                          {subscription.symbol}
                        </span>
                        <span className="ml-2 text-sm px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                          {subscription.type}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{subscription.condition}</div>
                    </div>
                    <div className="flex mt-2 sm:mt-0">
                      <Switch
                        checked={subscription.active}
                        onCheckedChange={() => toggleSubscription(subscription.id)}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-4 mt-4 border-t">
                  <h3 className="font-medium mb-4">Add New Alert</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-grow">
                      <Input
                        value={newAlertSymbol}
                        onChange={(e) => setNewAlertSymbol(e.target.value)}
                        placeholder="Enter stock symbol (e.g. AAPL)"
                      />
                    </div>
                    <Button onClick={handleSubscribe}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-trendmate-purple" />
                  You'll be notified when important market events occur for your subscribed stocks
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Notifications;
