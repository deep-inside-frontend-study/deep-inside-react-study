"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content || content.trim().length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem",
          color: "var(--text-muted)",
          textAlign: "center",
          gap: "0.75rem",
        }}
      >
        <span style={{ fontSize: "2.5rem" }}>📭</span>
        <p style={{ fontSize: "0.9rem" }}>아직 작성된 내용이 없어요.</p>
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
                <pre
                  style={{
                    background: "rgba(5,10,25,0.9)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "1.25rem",
                    overflowX: "auto",
                    margin: "1rem 0",
                  }}
                >
                  <code
                    className={className}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.875rem",
                      color: "#e2e8f0",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                style={{
                  background: "rgba(99,120,255,0.12)",
                  color: "#a78bfa",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.85em",
                }}
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
