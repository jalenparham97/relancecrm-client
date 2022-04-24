import { useCallback, useState } from 'react';
import { ActionIcon, Box, Menu, Button } from '@mantine/core';
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconChevronDown,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconQuote,
  IconStrikethrough,
} from '@tabler/icons';
import { capitalize } from 'lodash';
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  JSONContent,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { ProposalContent } from '@/core/types';
import { useRecoilState } from 'recoil';
import { proposalState } from '@/app/store';

interface Props {
  onContentUpdate?: (content: JSONContent | string) => void;
  defaultContent?: JSONContent[];
  block?: ProposalContent;
}

export default function BubbleEditor({
  onContentUpdate,
  defaultContent,
  block,
}: Props) {
  const [proposal, setProposal] = useRecoilState(proposalState);
  const [textFormat, setTextFormat] = useState('paragraph');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: {
      type: 'doc',
      content: defaultContent,
    },
    onUpdate({ editor }) {
      setProposal((prevProposal) => {
        const content = [...prevProposal.content];

        const currentBlock = content.find(
          (prevBlock) => prevBlock.id === block.id
        );

        const newBlock: ProposalContent = {
          ...currentBlock,
          content: editor.getJSON().content,
        };

        const blockIndex = content.findIndex(
          (prevBlock) => prevBlock.id === block.id
        );

        content.splice(blockIndex, 1, newBlock);

        console.log(content);

        return {
          ...prevProposal,
          content,
        };
      });
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const toggleAlignment = useCallback(
    (alignment: string) => {
      if (editor.isActive({ textAlign: alignment })) {
        editor.chain().focus().unsetTextAlign().run();
        return;
      }

      editor.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  type Level = 1 | 2 | 3 | 4 | 5 | 6;

  const setHeading = useCallback(
    (level: Level) => {
      editor.chain().focus().toggleHeading({ level }).run();
      switch (level) {
        case 1:
          setTextFormat('Heading 1');
          break;
        case 2:
          setTextFormat('Heading 2');
          break;
        case 3:
          setTextFormat('Heading 3');
          break;
        case 4:
          setTextFormat('Heading 4');
          break;

        default:
          break;
      }
    },
    [editor]
  );
  const setParagraph = useCallback(() => {
    editor.chain().focus().setParagraph().run();
    setTextFormat('Paragraph');
  }, [editor]);

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, hideOnClick: true }}
          className="bubble-menu flex justify-between p-[5px] bg-white border border-solid border-gray-300 shadow-xl rounded w-[480px]"
        >
          <Box className="flex space-x-1">
            <Menu
              shadow="xl"
              control={
                <Button
                  size="xs"
                  variant="default"
                  rightIcon={<IconChevronDown size={12} />}
                  className=" h-7"
                >
                  {capitalize(textFormat)}
                </Button>
              }
            >
              <Menu.Item
                className={
                  editor.isActive('paragraph') && 'bg-gray-300 bg-opacity-20'
                }
                onClick={setParagraph}
              >
                Paragraph
              </Menu.Item>
              <Menu.Item
                className={
                  editor.isActive('heading', { level: 1 }) &&
                  'bg-gray-300 bg-opacity-20'
                }
                onClick={() => setHeading(1)}
              >
                <h1 className="m-0">Heading 1</h1>
              </Menu.Item>
              <Menu.Item
                className={
                  editor.isActive('heading', { level: 2 }) &&
                  'bg-gray-300 bg-opacity-20'
                }
                onClick={() => setHeading(2)}
              >
                <h2 className="m-0">Heading 2</h2>
              </Menu.Item>
              <Menu.Item
                className={
                  editor.isActive('heading', { level: 3 }) &&
                  'bg-gray-300 bg-opacity-20'
                }
                onClick={() => setHeading(3)}
              >
                <h3 className="m-0">Heading 3</h3>
              </Menu.Item>
              <Menu.Item
                className={
                  editor.isActive('heading', { level: 4 }) &&
                  'bg-gray-300 bg-opacity-20'
                }
                onClick={() => setHeading(4)}
              >
                <h4 className="m-0">Heading 4</h4>
              </Menu.Item>
            </Menu>
            <ActionIcon
              onClick={() => editor.chain().focus().toggleBold().run()}
              variant={editor.isActive('bold') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconBold size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => editor.chain().focus().toggleItalic().run()}
              variant={editor.isActive('italic') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconItalic size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => editor.chain().focus().toggleStrike().run()}
              variant={editor.isActive('strike') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconStrikethrough size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              variant={editor.isActive('bulletList') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconList size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              variant={editor.isActive('orderedList') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconListNumbers size={16} />
            </ActionIcon>
          </Box>

          <Box className="flex space-x-1">
            <ActionIcon
              onClick={() => toggleAlignment('left')}
              variant={
                editor.isActive({ textAlign: 'left' }) ? 'light' : 'default'
              }
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconAlignLeft size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => toggleAlignment('center')}
              variant={
                editor.isActive({ textAlign: 'center' }) ? 'light' : 'default'
              }
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconAlignCenter size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => toggleAlignment('right')}
              variant={
                editor.isActive({ textAlign: 'right' }) ? 'light' : 'default'
              }
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconAlignRight size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => toggleAlignment('justify')}
              variant={
                editor.isActive({ textAlign: 'justify' }) ? 'light' : 'default'
              }
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconAlignJustified size={16} />
            </ActionIcon>
          </Box>

          <Box className="flex space-x-1">
            <ActionIcon
              onClick={setLink}
              variant={editor.isActive('link') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconLink size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              variant={editor.isActive('blockquote') ? 'light' : 'default'}
              color="indigo"
              className="border border-solid border-gray-400"
            >
              <IconQuote size={16} />
            </ActionIcon>
          </Box>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  );
}
