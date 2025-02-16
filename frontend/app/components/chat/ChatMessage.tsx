import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export const ChatMessage = ({ role, content }: { role: string; content: string }) => (
  <div
    className={`p-4 rounded-lg border-2 ${
      role === 'user'
        ? 'ml-8 border-electric-blue bg-gradient-to-r from-electric-blue/20 to-hot-pink/20'
        : 'mr-8 border-cyber-green bg-gradient-to-l from-cyber-green/20 to-hot-pink/20'
    } glow-animation`}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      className="prose text-cyber-white"
    >
      {content}
    </ReactMarkdown>
  </div>
);
