
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarkdownContentProps {
  content: string;
  title?: string;
}

// Simple markdown parsing function
const parseMarkdown = (markdown: string): string => {
  let html = markdown;
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italics
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert new lines to breaks
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
