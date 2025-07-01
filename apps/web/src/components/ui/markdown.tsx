import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

const baseStyles = {
  p: "text-apple-gray-600 leading-relaxed",
  h1: "text-2xl font-semibold text-apple-gray-900 tracking-tight mt-6 first:mt-0",
  h2: "text-xl font-semibold text-apple-gray-900 tracking-tight mt-6 first:mt-0",
  h3: "text-lg font-semibold text-apple-gray-900 tracking-tight mt-6 first:mt-0",
  h4: "text-base font-semibold text-apple-gray-900 tracking-tight mt-6 first:mt-0",
  h5: "text-sm font-semibold text-apple-gray-900 tracking-tight mt-6 first:mt-0",
  h6: "text-sm font-semibold text-apple-gray-900 tracking-tight mt-6 first:mt-0",
  strong: "font-medium text-apple-gray-800",
  em: "text-apple-gray-700",
  code: "text-apple-blue bg-apple-blue/5 rounded px-1 py-0.5 text-sm",
  pre: "bg-gray-50 border border-gray-100 rounded-lg p-4 overflow-x-auto",
  ul: "list-disc pl-6 text-apple-gray-600 space-y-2 mt-3",
  ol: "list-decimal pl-6 text-apple-gray-600 space-y-2 mt-3",
  li: "text-apple-gray-600",
  blockquote: "border-l-4 border-apple-blue/30 pl-4 italic text-apple-gray-600 my-4",
  hr: "border-gray-100 my-6",
  a: "text-apple-blue hover:underline",
  img: "rounded-lg max-w-full h-auto",
  table: "min-w-full divide-y divide-gray-200 my-6",
  th: "px-3 py-2 text-left text-sm font-semibold text-apple-gray-900 bg-gray-50",
  td: "px-3 py-2 text-sm text-apple-gray-600 border-t border-gray-100",
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose prose-gray max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className={baseStyles.p}>{children}</p>,
          h1: ({ children }) => <h1 className={baseStyles.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={baseStyles.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={baseStyles.h3}>{children}</h3>,
          h4: ({ children }) => <h4 className={baseStyles.h4}>{children}</h4>,
          h5: ({ children }) => <h5 className={baseStyles.h5}>{children}</h5>,
          h6: ({ children }) => <h6 className={baseStyles.h6}>{children}</h6>,
          strong: ({ children }) => <strong className={baseStyles.strong}>{children}</strong>,
          em: ({ children }) => <em className={baseStyles.em}>{children}</em>,
          code: ({ children }) => <code className={baseStyles.code}>{children}</code>,
          pre: ({ children }) => <pre className={baseStyles.pre}>{children}</pre>,
          ul: ({ children }) => <ul className={baseStyles.ul}>{children}</ul>,
          ol: ({ children }) => <ol className={baseStyles.ol}>{children}</ol>,
          li: ({ children }) => <li className={baseStyles.li}>{children}</li>,
          blockquote: ({ children }) => <blockquote className={baseStyles.blockquote}>{children}</blockquote>,
          hr: () => <hr className={baseStyles.hr} />,
          a: ({ href, children }) => (
            <a href={href} className={baseStyles.a} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => <img src={src} alt={alt} className={baseStyles.img} />,
          table: ({ children }) => <table className={baseStyles.table}>{children}</table>,
          th: ({ children }) => <th className={baseStyles.th}>{children}</th>,
          td: ({ children }) => <td className={baseStyles.td}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 