"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MDXRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 mt-8 mb-4 dark:text-zinc-50">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mt-8 mb-3 dark:text-zinc-100">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-zinc-800 mt-6 mb-2 dark:text-zinc-200">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-base leading-7 text-zinc-700 mb-4 dark:text-zinc-300">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-7">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
            {children}
          </strong>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-600 hover:underline dark:text-blue-400"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        hr: () => (
          <hr className="my-8 border-zinc-200 dark:border-zinc-700" />
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-zinc-300 pl-4 italic text-zinc-600 my-4 dark:border-zinc-600 dark:text-zinc-400">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse border border-zinc-300 dark:border-zinc-600">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-zinc-100 dark:bg-zinc-800">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-zinc-300 px-3 py-2 text-left font-semibold dark:border-zinc-600">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-zinc-300 px-3 py-2 dark:border-zinc-600">
            {children}
          </td>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ""}
            className="my-6 rounded-2xl max-w-full h-auto shadow-lg border border-zinc-200 dark:border-zinc-700"
            loading="lazy"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
