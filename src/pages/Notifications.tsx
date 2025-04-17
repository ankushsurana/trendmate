
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import CrossoverAlert from "@/components/StockComponents/CrossoverAlert";
import { useAlertsData, useCreateAlert } from "@/services/stockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bell, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const alertFormSchema = z.object({
  symbol: z.string().min(1, "Stock symbol is required"),
  alertType: z.enum(["MovingAverage", "BollingerBands"]),
  condition: z.string().min(1, "Condition is required"),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

const Notifications = () => {
  const { data: apiData, isLoading, error } = useAlertsData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, symbol: "AAPL", type: "Price Alert", threshold: "$190" },
    { id: 2, symbol: "MSFT", type: "Volume Alert", threshold: "25M shares" },
    { id: 3, symbol: "TSLA", type: "MA Crossover", threshold: "20-day & 50-day" },
  ]);
  const { toast } = useToast();
  const createAlert = useCreateAlert();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      symbol: "",
      alertType: "MovingAverage",
      condition: "",
    },
  });

  const selectedAlertType = form.watch("alertType");

  const handleDeleteSubscription = (id: number) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    toast({
      title: "Subscription deleted",
      description: "Your alert subscription has been removed.",
      duration: 3000,
    });
  };

  const onSubmit = async (data: AlertFormValues) => {
    try {
      // Call the API to create a new alert
      await createAlert.mutateAsync(data);
      
      // Add new subscription to the local state
      const newSubscription = {
        id: Date.now(),
        symbol: data.symbol,
        type: data.alertType,
        threshold: data.condition,
      };
      
      setSubscriptions([...subscriptions, newSubscription]);
      
      toast({
        title: "Alert created",
        description: `New ${data.alertType} alert for ${data.symbol} has been created.`,
        duration: 3000,
      });
      
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create alert. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-trendmate-dark">Notifications</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-trendmate-purple hover:bg-trendmate-purple-light">
                <Bell className="h-4 w-4 mr-2" />
                Create New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>
                  Set up custom alerts for stock movements
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., AAPL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="alertType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alert type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MovingAverage">Moving Average</SelectItem>
                            <SelectItem value="BollingerBands">Bollinger Bands</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedAlertType === "MovingAverage" ? (
                              <>
                                <SelectItem value="bullish">Bullish</SelectItem>
                                <SelectItem value="bearish">Bearish</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="overBought">Over Bought</SelectItem>
                                <SelectItem value="overSold">Over Sold</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={createAlert.isPending}
                    >
                      {createAlert.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Alert"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Recent Alerts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
              
              {isLoading ? (
                <Card className="dashboard-card">
                  <CardContent className="p-6 flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 text-trendmate-purple animate-spin" />
                  </CardContent>
                </Card>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading alerts. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : !apiData || !apiData.content || !apiData.content.alerts || apiData.content.alerts.length === 0 ? (
                <Card className="dashboard-card">
                  <CardContent className="p-6 text-center text-gray-500">
                    <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No recent alerts found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {apiData.content.alerts.map((alert, index) => (
                    <CrossoverAlert
                      key={index}
                      symbol={alert.symbol}
                      alertType={alert.alertType}
                      message={alert.message}
                      timestamp={alert.timestamp}
                      isImportant={alert.isImportant}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Market News</h2>
              <Alert variant="default" className="bg-amber-50 border border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <AlertDescription className="text-amber-800">
                  New feature coming soon! Get daily market news and insights.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Right column - Your Subscriptions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Alert Subscriptions</h2>
            <Card className="dashboard-card">
              <CardContent className="p-6">
                {subscriptions.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No active subscriptions</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{subscription.symbol}</div>
                          <div className="text-sm text-gray-500">
                            {subscription.type} ({subscription.threshold})
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSubscription(subscription.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-500">Receive alerts via email</div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Browser Notifications</div>
                        <div className="text-sm text-gray-500">Real-time browser alerts</div>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Notifications;
