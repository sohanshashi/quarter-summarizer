import { $getRoot } from "lexical";
import { useEffect, useState, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";

import { editorTheme } from "@/lib/constants";

function onError(error: Error) {
  console.error("Lexical editor error", error);
}

// Plugin to make editor read-only and sync with controlled markdown value
function ReadOnlyPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(false);
  }, [editor]);

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();

      if (value) {
        $convertFromMarkdownString(value, TRANSFORMERS);
      }
    });
  }, [editor, value]);

  return null;
}

type EditorProps = {
  value: string;
};

export function ResponseTextArea({ value }: EditorProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  const initialConfig = {
    namespace: "AIResponseEditor",
    theme: editorTheme,
    editable: false,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (!isUserScrollingRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [value]);

  // Detect manual scrolling
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;

    // If user scrolls up, stop auto-scrolling
    if (!isAtBottom) {
      isUserScrollingRef.current = true;
    } else {
      // If user scrolls back to bottom, resume auto-scrolling
      isUserScrollingRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="bg-grey rounded-md border border-primary/50 p-5 min-h-[600px] max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500 relative"
    >
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm text-gray-200 flex items-center gap-2"
      >
        {copied ? (
          <p>Copied!</p>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy
          </>
        )}
      </button>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="focus:outline-none prose prose-lg max-w-none dark:prose-invert pr-24 pt-2" />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ReadOnlyPlugin value={value} />
      </LexicalComposer>
    </div>
  );
}
