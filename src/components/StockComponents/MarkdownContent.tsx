import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownContentProps {
  content: string;
  title?: string;
  className?: string;
}

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
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                <table
                  {...props}
                  className="w-full table-auto divide-y divide-gray-300 text-sm text-left text-gray-700"
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead {...props} className="bg-gray-50 sticky top-0 z-10" />
            ),
            th: ({ node, ...props }) => (
              <th
                {...props}
                className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap"
              />
            ),
            td: ({ node, ...props }) => (
              <td
                {...props}
                className="px-4 py-2 text-gray-600 whitespace-nowrap"
              />
            ),
            tr: ({ node, ...props }) => (
              <tr
                {...props}
                className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
              />
            ),
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
