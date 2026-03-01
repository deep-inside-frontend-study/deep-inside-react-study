"use client";

import { ReactNode } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  /** 내용이 없을 때 렌더링할 요소. 기본값: 빈 상태 안내 UI */
  emptyState?: ReactNode;
}

const DefaultEmptyState = (
  <div className="flex flex-col items-center p-12 text-slate-500 text-center gap-3">
    <span className="text-[2.5rem]">📭</span>
    <p className="text-[0.9rem]">아직 작성된 내용이 없어요.</p>
  </div>
);

const remarkPluginsConfig = [remarkGfm];

const markdownComponents: Components = {
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
};

export function MarkdownRenderer({
  content,
  emptyState = DefaultEmptyState,
}: MarkdownRendererProps) {
  if (!content || content.trim().length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={remarkPluginsConfig}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
