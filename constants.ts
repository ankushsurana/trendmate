export const INTEGRATION_IDS = {
    companySearch: "workflow-for-fetch-real-time-data-copy-1741346734879",
    companySelect: "select-company-9826",
    createAlert: "alert-table-2938",
    dailyNotification: "fetchdailynotification-5882",
    fetchAlerts: "fetchalerts-from-table-4625",
};

export const API_HEADERS = {
    'widgetKey': process.env.NEXT_PUBLIC_WIDGET_KEY || '',
    'appid': process.env.NEXT_PUBLIC_APP_ID || '',
    'agentId': process.env.NEXT_PUBLIC_AGENT_ID || '',
    'Content-Type': 'application/json'
};