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
  icon = <BarChart2 className="mr-2 h-5 w-5 text-trendmate-purple" />,
}: ReportSummaryProps) => {
  const formatContent = (text: string) => {
    // Process HTML headings
    let processedText = text
      .replace(/<h1>(.*?)<\/h1>/g, '\n# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '\n## $1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '\n### $1\n')
      .replace(/<h4>(.*?)<\/h4>/g, '\n#### $1\n')
      .replace(/<h5>(.*?)<\/h5>/g, '\n##### $1\n')
      .replace(/<h6>(.*?)<\/h6>/g, '\n###### $1\n');

    // Process HTML lists
    processedText = processedText
      .replace(/<ul>|<ol>/g, '\n')
      .replace(/<\/ul>|<\/ol>/g, '\n')
      .replace(/<li>(.*?)<\/li>/g, '\n- $1');

    // Process text formatting
    processedText = processedText
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*');

    // Process paragraphs and breaks
    processedText = processedText
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br\s?\/?>/g, '\n');

    // Remove any remaining HTML tags
    processedText = processedText.replace(/<\/?[^>]+(>|$)/g, "");

    // Split into paragraphs
    const paragraphs = processedText.split(/\n{2,}|\r\n{2,}/).filter(Boolean);

    return paragraphs.map((paragraph, idx) => {
      const trimmedPara = paragraph.trim();

      // Handle headers
      if (trimmedPara.startsWith('#')) {
        const level = (trimmedPara.match(/^#+/) || ['#'])[0].length;
        const headerText = trimmedPara.replace(/^#+\s*/, '');
        const headerClass = `font-bold mb-3 mt-4 ${level === 1 ? "text-2xl text-blue-900" :
          level === 2 ? "text-xl text-blue-800" :
            level === 3 ? "text-lg text-blue-700" :
              "text-base text-blue-600"
          }`;

        return <h3 key={idx} className={headerClass}>{headerText}</h3>;
      }

      // Handle lists
      if (paragraph.includes('\n- ') || paragraph.includes('\n* ') || paragraph.match(/^\s*[-*]\s+/)) {
        const listContent = paragraph.split(/\n\s*[-*]\s+/).filter(Boolean);
        const firstItem = listContent[0];
        const items = listContent.slice(1);

        return (
          <div key={idx} className="mb-4">
            {firstItem && !firstItem.match(/^\s*[-*]\s+/) && (
              <p className="mb-2 text-gray-700">{firstItem.trim()}</p>
            )}
            <ul className="space-y-1 list-disc pl-5">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">{item.trim()}</li>
              ))}
            </ul>
          </div>
        );
      }

      if (trimmedPara.includes(': ') && !trimmedPara.includes('\n')) {
        const [key, ...valueParts] = trimmedPara.split(': ');
        const value = valueParts.join(': ');

        return (
          <div key={idx} className="mb-3 flex flex-wrap">
            <span className="font-semibold text-blue-900 mr-1">{key}:</span>
            <span className="text-gray-800">{value}</span>
          </div>
        );
      }

      if (trimmedPara.includes('**')) {
        const parts = trimmedPara.split('**');
        return (
          <p key={idx} className="mb-3 text-gray-800 leading-relaxed">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="text-blue-900">{part}</strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      return (
        <p key={idx} className="mb-3 text-gray-800 leading-relaxed">
          {trimmedPara}
        </p>
      );
    });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg border border-blue-100 overflow-hidden">
      <CardHeader className="pb-3 border-b border-blue-100 bg-white bg-opacity-60">
        <CardTitle className="text-xl flex items-center font-bold text-blue-900">
          {icon}
          {title} {symbol && <span className="text-purple-700 ml-1">for {symbol.toUpperCase()}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 ">
        <div className="space-y-6">
          {insights.map((section, index) => (
            <div
              key={index}
              className="p-5 rounded-lg bg-white border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b border-blue-100 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {section.title}
              </h3>
              <div className="text-base space-y-3 pl-1">
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