import { $getRoot } from "lexical";
import { useEffect } from "react";
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="p-6 text-gray-100 focus:outline-none" />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ReadOnlyPlugin value={value} />
    </LexicalComposer>
  );
}
