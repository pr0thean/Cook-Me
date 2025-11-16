'use client'

import { Label } from '@components/atoms/Label'
import './tiptap.css'
import { Editor, EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type MenuButton = {
  label: string
  action: () => boolean
  isActive?: boolean
}

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
      }
    },
  })

  const buttons: MenuButton[] = [
    {
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editorState.isBold,
    },
    {
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editorState.isItalic,
    },
    {
      label: 'Paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editorState.isParagraph,
    },
    {
      label: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editorState.isHeading1,
    },
    {
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState.isHeading2,
    },
    {
      label: 'Bullet list',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editorState.isBulletList,
    },
    {
      label: 'Ordered list',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editorState.isOrderedList,
    },
  ]

  const baseButtonClass = 'p-2 border-r border-b border-blue-gray bg-blue-gray-dark cursor-pointer'
  const inactiveButtonClass = 'font-normal'
  const activeButtonClass = 'font-semibold'

  return (
    <div className="flex flex-wrap text-sm">
      {buttons.map((button) => (
        <button
          key={button.label}
          type="button"
          onClick={button.action}
          className={` ${baseButtonClass} ${button.isActive ? activeButtonClass : inactiveButtonClass} `}
        >
          {button.label}
        </button>
      ))}
    </div>
  )
}

type Props = {
  name: string
  label?: string
}

export const TextEditor = ({ name, label }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  const htmlContent = editor.getHTML()

  return (
    <div>
      {label && <Label name={name} label={label} />}

      <div className="border-blue-gray w-full rounded border text-white">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="bg-gray-light m-2 p-1 text-black outline-none" />
        <input type="hidden" id={name} name={name} value={htmlContent} />
      </div>
    </div>
  )
}
