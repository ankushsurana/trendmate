import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import CrossoverAlert from "@/components/StockComponents/CrossoverAlert";
import { useAlertsDataQuery, useCreateAlertMutation } from "@/services/stockApi";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Bell, Loader2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const alertFormSchema = z.object({
  symbol: z.string().min(1, "Stock symbol is required"),
  alertType: z.enum(["MovingAverage", "BollingerBands"]),
  condition: z.enum(["bullish", "bearish", "overBought", "overSold"]),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

const Notifications = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const createAlertMutation = useCreateAlertMutation();
  const { data: alerts = [], isLoading, error } = useAlertsDataQuery();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      symbol: "",
      alertType: "MovingAverage",
      condition: "bullish",
    },
  });

  const selectedAlertType = form.watch("alertType");

  const onSubmit = async (data: AlertFormValues) => {
    try {
      await createAlertMutation.mutateAsync({
        symbol: data.symbol,
        alertType: data.alertType,
        condition: data.condition
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create alert",
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Button type="submit" disabled={createAlertMutation.isPending}>
                      {createAlertMutation.isPending ? (
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
              ) : alerts?.length === 0 ? (
                <Card className="dashboard-card">
                  <CardContent className="p-6 text-center text-gray-500">
                    <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No recent alerts found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <CrossoverAlert
                      key={index}
                      symbol={alert.symbol}
                      alertType={alert.alertType}
                      condition={alert.condition}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Alert Subscriptions</h2>
            <Card className="dashboard-card">
              <CardContent className="p-6">
                {alerts?.length === 0 && !isLoading ? (
                  <div className="text-center text-gray-500 py-6">
                    <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No active subscriptions</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Alert Type</TableHead>
                        <TableHead>Condition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : (
                        alerts.map((alert, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{alert.symbol}</TableCell>
                            <TableCell>{alert.alertType}</TableCell>
                            <TableCell>{alert.condition || "-"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Notifications;
