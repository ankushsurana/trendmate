import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown support
import rehypeRaw from 'rehype-raw'; // To safely parse raw HTML

interface MarkdownContentProps {
  content: string;
  title?: string;
  className?: string;
}

/**
 * Renders Markdown content with proper styling and sanitization
 */
const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, title, className }) => {
  return (
    <Card className={`dashboard-card ${className || ''}`}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ReactMarkdown
          components={{
            div: ({ children }) => (
              <div className="prose prose-sm max-w-none text-trendmate-dark">
                {children}
              </div>
            ),
          }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default MarkdownContent;