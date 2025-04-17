
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface InsightItem {
  title: string;
  content: string;
}

interface ReportSummaryProps {
  symbol: string;
  insights: InsightItem[];
  title?: string;
  icon?: React.ReactNode;
}

const ReportSummary = ({
  symbol,
  insights,
  title = "Trendmate AI Analysis",
  icon = <BarChart2 className="mr-2 h-5 w-5 text-trendmate-purple" />
}: ReportSummaryProps) => {
  // Parse content into structured sections for better display
  const formatContent = (text: string) => {
    // Split content by newlines or double breaks
    const paragraphs = text.split(/\n{2,}|\r\n{2,}|<br><br>/).filter(Boolean);
    
    // Process paragraphs to find headers and lists
    return paragraphs.map((paragraph, idx) => {
      // Check if paragraph is a header (starts with # or contains : at the end)
      if (paragraph.startsWith('#') || paragraph.includes(':')) {
        const headerText = paragraph.replace(/^#+\s*/, '');
        return (
          <div key={idx} className="mb-4">
            <h3 className="text-xl font-bold text-blue-800">{headerText}</h3>
          </div>
        );
      }
      
      // Check if paragraph contains list items (starts with - or *)
      if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
        const listItems = paragraph
          .split(/\n[-*]\s+/)
          .filter(Boolean)
          .map((item, i) => (
            <li key={i} className="ml-4 list-disc">{item.trim()}</li>
          ));
        
        return (
          <ul key={idx} className="mb-4 space-y-1 text-gray-700">
            {listItems}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph.trim()}
        </p>
      );
    });
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center font-semibold">
          {icon}
          {title} {symbol && `for ${symbol}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((section, index) => (
            <div
              key={index}
              className="p-4 rounded-md bg-blue-50 border-l-4 border-blue-400 shadow-sm"
            >
              {/* Heading */}
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                {section.title}
              </h3>

              {/* Content */}
              <div className="text-base">
                {formatContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummary;
