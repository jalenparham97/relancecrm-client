import React from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { Box, Divider, Grid, Group, Table, Text } from '@mantine/core';
import { ProposalContent } from '@/core/types';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { formatCurrency } from '@/core/utils';
import {
  getProposalItemSubtotal,
  getProposalSubtotal,
  getProposalTotalAmount,
} from '@/app/utils';

interface Props {
  block?: ProposalContent;
}

export default function ProposalContentRenderer({ block }: Props) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: {
      type: 'doc',
      content: block.content as JSONContent[],
    },
  });

  return (
    <Box>
      <EditorContent editor={editor} />
      {block.type === 'estimate' && (
        <>
          <Table className="table-fixed" verticalSpacing="xs">
            <thead>
              <tr>
                <th className="!px-0 !w-8/12">Description</th>
                <th className="!px-0 !w-1/3 !text-right">Units/hrs</th>
                <th className="!px-0 !w-1/3 !text-right">Rate</th>
                <th className="!px-0 !w-1/3 !text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {block.items.map((item) => (
                <tr key={item.id}>
                  <td className="!px-0">{item.description}</td>
                  <td className="!px-0 text-right">
                    {item.units} {item.unitsType}
                  </td>
                  <td className="!px-0 text-right">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="!px-0 text-right">
                    {formatCurrency(getProposalItemSubtotal(item))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Divider className="mb-3" />

          <Grid>
            <Grid.Col span={7}></Grid.Col>
            <Grid.Col span={5}>
              <Box>
                <Group direction="column" grow spacing="xs">
                  <Group position="apart" align="center">
                    <Text size="sm" className="font-medium">
                      Subtotal
                    </Text>
                    <Text size="sm">
                      {formatCurrency(getProposalSubtotal(block?.items))}
                    </Text>
                  </Group>
                  {block.discount && (
                    <Group position="apart" align="center" spacing="xs">
                      <Text size="sm" className="font-medium">
                        Discount
                      </Text>
                      <Text size="sm">-{formatCurrency(block.discount)}</Text>
                    </Group>
                  )}
                  <Divider />
                  <Group position="apart" align="center" spacing="xs">
                    <Text className="font-medium">Total</Text>
                    <Text>
                      {formatCurrency(getProposalTotalAmount(block) || 0)}
                    </Text>
                  </Group>
                </Group>
              </Box>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Box>
  );
}
