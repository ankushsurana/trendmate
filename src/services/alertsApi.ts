
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeApiRequest } from "./apiConfig";
import { AlertsApiResponse, AlertFormData } from "./types";

// API function to fetch alerts data
export const fetchAlertsData = async (): Promise<AlertsApiResponse> => {
  return makeApiRequest("alert-table-2938", "latest stock alerts");
};

// API function to create a new alert
export const createAlert = async (alertData: AlertFormData): Promise<any> => {
  const query = `create alert for ${alertData.symbol} with ${alertData.alertType} ${alertData.condition}`;
  return makeApiRequest("create-alert-9841", query);
};

// API function to delete an alert
export const deleteAlert = async (alertId: string): Promise<any> => {
  return makeApiRequest("delete-alert-8754", `delete alert ${alertId}`);
};

// API function to toggle alert status
export const toggleAlertStatus = async (alertId: string, enable: boolean): Promise<any> => {
  const action = enable ? "enable" : "disable";
  return makeApiRequest("toggle-alert-3421", `${action} alert ${alertId}`);
};

// Custom hook for alerts data
export const useAlertsData = () => {
  return useQuery({
    queryKey: ['alertsData'],
    queryFn: fetchAlertsData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 1,  // Limit retries to avoid excessive API calls
  });
};

// Custom hook for alert creation
export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      // Invalidate and refetch the alerts data
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
};

// Custom hooks for alert deletion
export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
};

// Custom hook for toggling alert status
export const useToggleAlertStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ alertId, enable }: { alertId: string, enable: boolean }) => 
      toggleAlertStatus(alertId, enable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertsData'] });
    }
  });
};
