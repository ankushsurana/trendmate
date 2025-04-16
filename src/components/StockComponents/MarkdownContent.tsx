
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarkdownContentProps {
  content: string;
  title?: string;
}

const parseMarkdown = (markdown: string): string => {
  let html = markdown;

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  html = html.replace(/\n/g, '<br>');

  return html;
};

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, title }) => {
  return (
    <Card className="dashboard-card">
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
      </CardContent>
    </Card>
  );
};

export default MarkdownContent;
