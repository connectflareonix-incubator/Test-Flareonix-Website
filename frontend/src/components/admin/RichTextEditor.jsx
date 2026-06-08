import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Heading2, List, ListOrdered, Link2, Image as ImgIcon } from 'lucide-react';

const Btn = ({ active, onClick, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded ${active ? 'bg-[#FF6B00] text-white' : 'hover:bg-white/10'}`}
  >
    {children}
  </button>
);

const Toolbar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-1 border-b border-white/10 p-2">
      <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
      <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
      <Btn title="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
      <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
      <Btn title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
      <Btn title="Link" active={editor.isActive('link')} onClick={() => {
        const url = prompt('URL');
        if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }}><Link2 className="h-4 w-4" /></Btn>
      <Btn title="Image URL" onClick={() => {
        const url = prompt('Image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }}><ImgIcon className="h-4 w-4" /></Btn>
    </div>
  );
};

const RichTextEditor = ({ value = '', onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content: value,
    onUpdate: ({ editor: e }) => onChange && onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[180px] p-3 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || '', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="bg-black/40 border border-white/10 rounded-lg">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
