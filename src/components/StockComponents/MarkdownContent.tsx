
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent } from '@/components/ui/card';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: FC<MarkdownContentProps> = ({ content }) => {
  // Clean up content - remove HTML tags but preserve markdown formatting
  const cleanContent = content
    .replace(/<\/?(?!br)[^>]+>/g, '') // Remove all HTML tags except <br>
    .replace(/<br\s*\/?>/gi, '\n\n') // Replace <br> tags with newlines
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with regular spaces
    .replace(/(\n\s*){3,}/g, '\n\n'); // Remove excessive newlines
    
  return (
    <Card className="dashboard-card overflow-hidden">
      <CardContent className="p-6 prose max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
        >
          {cleanContent}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default MarkdownContent;
