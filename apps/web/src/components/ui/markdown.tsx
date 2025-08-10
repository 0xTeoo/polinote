import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MarkdownProps {
  content: string;
  className?: string;
}

const baseStyles = {
  p: "text-neutral-700 leading-relaxed mb-4",
  h1: "text-3xl font-bold text-neutral-900 tracking-tight mt-8 mb-6 first:mt-0",
  h2: "text-2xl font-semibold text-neutral-900 tracking-tight mt-8 mb-4 first:mt-0",
  h3: "text-xl font-semibold text-neutral-900 tracking-tight mt-6 mb-3",
  h4: "text-lg font-semibold text-neutral-900 tracking-tight mt-6 mb-3",
  h5: "text-base font-semibold text-neutral-900 tracking-tight mt-4 mb-2",
  h6: "text-sm font-semibold text-neutral-900 tracking-tight mt-4 mb-2",
  strong: "font-semibold text-neutral-800",
  em: "text-neutral-700 italic",
  code: "text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 text-sm font-mono",
  pre: "bg-neutral-50 border border-neutral-200 rounded-lg p-4 overflow-x-auto mb-4",
  ul: "list-disc pl-6 text-neutral-700 space-y-2 mt-3 mb-4",
  ol: "list-decimal pl-6 text-neutral-700 space-y-2 mt-3 mb-4",
  li: "text-neutral-700 leading-relaxed",
  blockquote: "border-l-4 border-blue-500/30 pl-4 italic text-neutral-600 my-6 bg-blue-50/30 py-2 rounded-r",
  hr: "border-neutral-200 my-8",
  a: "text-blue-600 hover:text-blue-700 hover:underline",
  img: "rounded-lg max-w-full h-auto",
  table: "min-w-full divide-y divide-neutral-200 my-6 border border-neutral-200 rounded-lg overflow-hidden",
  th: "px-4 py-3 text-left text-sm font-semibold text-neutral-900 bg-neutral-50 border-b border-neutral-200",
  td: "px-4 py-3 text-sm text-neutral-700 border-b border-neutral-100",
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose prose-neutral max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
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
          img: ({ src, alt }) => src && typeof src === 'string' ? <Image src={src} alt={alt || ''} className={baseStyles.img} width={100} height={100} /> : null,
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