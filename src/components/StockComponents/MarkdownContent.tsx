
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarkdownContentProps {
  content: string;
  title?: string;
  className?: string;
}

/**
 * Renders HTML or markdown content safely
 */
const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, title, className }) => {
  // Clean up any special character markers or script tags for security
  const sanitizeContent = (html: string): string => {
    const cleaned = html
      .replace(/\$agent\.[^\s<]+/g, '') // Remove any $agent.* markers
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // Remove scripts
    
    return cleaned;
  };

  return (
    <Card className={`dashboard-card ${className || ''}`}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }}
        />
      </CardContent>
    </Card>
  );
};

export default MarkdownContent;
