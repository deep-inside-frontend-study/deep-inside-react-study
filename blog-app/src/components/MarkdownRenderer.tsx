"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content || content.trim().length === 0) {
    return (
      <div className="flex flex-col items-center p-12 text-slate-500 text-center gap-3">
        <span className="text-[2.5rem]">📭</span>
        <p className="text-[0.9rem]">아직 작성된 내용이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code block 커스텀 처리
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isBlock = !!(
              match ||
              (typeof children === "string" && children.includes("\n"))
            );
            if (isBlock) {
              return (
                <pre className="bg-[rgba(5,10,25,0.9)] border border-slate-800 rounded-[10px] p-5 overflow-x-auto my-4">
                  <code
                    className={`${className || ""} font-mono text-sm text-slate-200`}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                className="bg-[rgba(99,120,255,0.12)] text-violet-400 px-1.5 py-0.5 rounded font-mono text-[0.85em]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
