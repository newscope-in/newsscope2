"use client"

import dynamic from "next/dynamic"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import { useState } from "react"

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [preview, setPreview] = useState<"edit" | "preview">("edit")

  return (
    <div className="markdown-editor" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview={preview}
        height={400}
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder || "Write your content in markdown...",
        }}
        previewOptions={{
          className: "prose prose-gray max-w-none dark:prose-invert",
        }}
      />
      <div className="mt-2 flex justify-end space-x-2">
        <button
          onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {preview === "edit" ? "Show Preview" : "Show Editor"}
        </button>
      </div>
    </div>
  )
}

