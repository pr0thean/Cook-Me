'use client'

import { Label } from 'components/atoms/Label'
import './tiptap.css'
import { Editor, EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'

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
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
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
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState.isHeading2,
    },
    {
      label: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editorState.isHeading3,
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

  const baseButtonClass = 'p-2 border-r border-b border-blue-gray cursor-pointer'
  const inactiveButtonClass = 'font-normal bg-blue-gray-dark'
  const activeButtonClass = 'font-semibold bg-black'

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
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = JSON.stringify(editor.getJSON())
      }
    },
  })

  // Set initial value
  useEffect(() => {
    if (editor && hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(editor.getJSON())
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div>
      {label && <Label name={name} label={label} />}

      <div className="border-blue-gray w-full rounded border text-white">
        <MenuBar editor={editor} />
        <EditorContent
          id={name}
          editor={editor}
          className="bg-gray-light m-2 p-1 text-black outline-none"
        />
        <input type="hidden" name={name} ref={hiddenInputRef} />
      </div>
    </div>
  )
}
