'use client'

import './tiptap.css'
import { Content, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Props = {
  content: Content // TipTap JSON content
  className?: string
}

export const RichTextViewer = ({ content, className }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false, // read-only
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  )
}
