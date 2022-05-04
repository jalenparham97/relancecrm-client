import {
  Box,
  Collapse,
  Grid,
  UnstyledButton,
  Text,
  Input,
  Group,
  ActionIcon,
  Title,
  Paper,
  NativeSelect,
  Divider,
} from '@mantine/core';
import { proposalState, selectedBlockState } from '@/app/store';
import {
  estimateContent,
  getProposalItemSubtotal,
  getProposalSubtotal,
  getProposalTotalAmount,
  textContent,
  timelineContent,
} from '@/app/utils';
import { formatCurrency } from '@/core/utils';
import {
  ProposalContent,
  ProposalContentBlocksType,
  ProposalEstimateItem,
} from '@/core/types';
import { useHover } from '@mantine/hooks';
import {
  IconGripVertical,
  IconLetterT,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconX,
  IconClock,
  IconReceipt,
} from '@tabler/icons';
import { JSONContent } from '@tiptap/react';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { useToggle, useUnmount } from 'react-use';
import { useRecoilState } from 'recoil';
import BubbleEditor from '../shared/BubbleEditor';
import ProposalContentBlock from './ProposalContentBlock';
import Button from '../shared/Button';

interface Props {
  block?: ProposalContent;
}

export default function ProposalBlock({ block }: Props) {
  const { hovered, ref } = useHover();
  const { hovered: addBlockHovered, ref: addBlockRef } = useHover();
  const [proposal, setProposal] = useRecoilState(proposalState);
  const [selectedId, setSelectedId] = useRecoilState(selectedBlockState);
  const [openedCollapse, toggleCollapse] = useToggle(false);

  useUnmount(() => setSelectedId(''));

  useEffect(() => {
    setSelectedId('');
    toggleCollapse(false);
  }, [proposal?.content?.length]);

  const handleSelect = () => {
    setSelectedId(block?.id);
    toggleCollapse();
  };
  const resetSelectedId = () => {
    setSelectedId('');
    toggleCollapse();
  };

  const isSelected = block?.id === selectedId;

  const deleteBlock = () => {
    const updatedContent = proposal.content.filter((el) => el.id !== block.id);
    setProposal((prevForm) => ({
      ...prevForm,
      content: updatedContent,
    }));
  };

  const insertBlock = (
    content: ProposalContent[],
    type: ProposalContentBlocksType
  ) => {
    const newContent = [...content];

    const block: ProposalContent = {
      id: nanoid(8),
      type,
    };

    switch (type) {
      case 'text':
        block.content = textContent;
        break;
      case 'timeline':
        block.content = timelineContent;
        break;
      case 'estimate':
        block.discount = 0;
        block.subtotal = 0;
        block.total = 0;
        block.items = [
          {
            id: nanoid(8),
            description: '',
            rate: 0,
            units: 0,
            unitsType: 'units',
          },
        ];
        block.content = estimateContent;
        break;
      default:
        break;
    }

    const insertIndex = newContent.findIndex((el) => el.id === selectedId);

    if (selectedId) {
      newContent.splice(insertIndex, 0, block);
    } else {
      newContent.push(block);
    }

    toggleCollapse();
    return newContent;
  };

  const addTextBlock = () => {
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: insertBlock(prevProposal.content, 'text'),
    }));
    setSelectedId('');
  };

  const addTimelineBlock = () => {
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: insertBlock(prevProposal.content, 'timeline'),
    }));
  };

  const addEstimateBlock = () => {
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: insertBlock(prevProposal.content, 'estimate'),
    }));
  };

  const handleDiscountChange = (
    e: React.ChangeEvent<{ value: string; name: string }>
  ) => {
    const { name, value } = e.target;

    const updatedProposalContentItems = proposal.content.map((block) => {
      if (block.type == 'estimate') {
        return { ...block, [name]: value };
      }
      return { ...block };
    });

    setProposal((prevState) => ({
      ...prevState,
      content: updatedProposalContentItems,
    }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.currentTarget;
    const itemId = id.split('--')[0];
    const updatedProposalContentItems = proposal.content.map((block) => {
      if (block.type == 'estimate') {
        const updatedEstimateItems = block.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, [name]: value };
          }
          return item;
        });

        return { ...block, items: updatedEstimateItems };
      }

      return { ...block };
    });

    setProposal((prevState) => ({
      ...prevState,
      content: updatedProposalContentItems,
    }));
  };

  const handleSelectItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const itemId = name.split('--')[0];
    const itemName = name.split('--')[1];
    const updatedProposalContentItems = proposal.content.map((block) => {
      if (block.type == 'estimate') {
        const updatedEstimateItems = block.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              [itemName]: value,
            };
          }
          return item;
        });

        return { ...block, items: updatedEstimateItems };
      }

      return { ...block };
    });

    setProposal((prevState) => ({
      ...prevState,
      content: updatedProposalContentItems,
    }));
  };

  const createItem = (): ProposalEstimateItem => {
    const itemId = (() => nanoid())();
    return {
      id: itemId,
      rate: 0,
      description: '',
      units: 0,
      unitsType: 'units',
    };
  };

  const handleAddItem = () => {
    const newItem = createItem();
    setProposal((prevState) => ({
      ...prevState,
      content: prevState.content.map((block) => {
        if (block.type === 'estimate') {
          const newBlock = { ...block };
          newBlock.items = [...newBlock.items, newItem];
          return newBlock;
        }

        return block;
      }),
    }));
  };

  const handleDeleteItem = (block: ProposalContent, itemId: string) => {
    if (block?.items.length === 1) {
      setProposal((prevState) => ({
        ...prevState,
        content: prevState.content.map((block) => {
          if (block.type === 'estimate') {
            const newBlock = { ...block };
            newBlock.items = [createItem()];
            return newBlock;
          }

          return block;
        }),
      }));
    } else {
      setProposal((prevState) => ({
        ...prevState,
        content: prevState.content.map((block) => {
          if (block.type === 'estimate') {
            const newBlock = { ...block };
            newBlock.items = block.items.filter((block) => block.id !== itemId);
            return newBlock;
          }

          return block;
        }),
      }));
    }
  };

  const showButton = addBlockHovered || isSelected;

  return (
    <Box>
      <Box
        ref={ref}
        key={block.id}
        className={`px-[50px] py-[40px] border-transparent border-y-[1px] border-solid border-x-0 hover:border-gray-300 hover:shadow-xl relative ${
          isSelected && 'border-t border-t-gray-300 border-solid border-x-0'
        }`}
      >
        <Box
          ref={addBlockRef}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[60px]"
        >
          {showButton && (
            <Box>
              {!isSelected ? (
                <UnstyledButton
                  onClick={handleSelect}
                  className="absolute top-[30px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[8px] bg-indigo-600 text-white font-medium rounded text-sm hover:bg-indigo-700 shadow-lg"
                >
                  <IconPlus
                    size={20}
                    className="flex items-center justify-center"
                  />
                </UnstyledButton>
              ) : (
                <>
                  <UnstyledButton
                    onClick={resetSelectedId}
                    className="absolute top-[30px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[8px] bg-white text-red-600 font-medium rounded-full text-sm border border-red-600 border-solid shadow-lg"
                  >
                    <IconX
                      size={20}
                      className="flex items-center justify-center"
                    />
                  </UnstyledButton>
                </>
              )}
            </Box>
          )}
        </Box>
        <Collapse in={openedCollapse} className="mb-[20px]">
          <Box className="grid grid-cols-4 gap-4">
            <ProposalContentBlock
              icon={<IconLetterT size="20px" />}
              name="Text"
              onClick={addTextBlock}
            />
            <ProposalContentBlock
              icon={<IconPhoto size="20px" />}
              name="Image"
              // onClick={addHeadingElement}
            />
            <ProposalContentBlock
              icon={<IconClock size="20px" />}
              name="Timeline"
              onClick={addTimelineBlock}
            />
            <ProposalContentBlock
              disabled={
                !!proposal?.content.find((block) => block.type === 'estimate')
              }
              icon={<IconReceipt size="20px" />}
              name="Estimate"
              onClick={addEstimateBlock}
            />
          </Box>
        </Collapse>
        <Box className="absolute top-[4px] right-1 flex flex-col space-y-2">
          {hovered && (
            <>
              <IconGripVertical className="text-gray-600 cursor-pointer" />
              <IconTrash
                size={20}
                className="cursor-pointer ml-[2px] text-red-600"
                onClick={deleteBlock}
              />
            </>
          )}
        </Box>
        <BubbleEditor
          defaultContent={block.content as JSONContent[]}
          block={block}
        />
        {block?.type === 'estimate' && (
          <>
            <Box className="">
              <Grid mt={5}>
                <Grid.Col span={5}>
                  <Text size="sm" className="font-medium">
                    Description
                  </Text>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Text size="sm" className="font-medium">
                    Units/hrs
                  </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text size="sm" className="font-medium">
                    Rate
                  </Text>
                </Grid.Col>
                <Grid.Col span={1}>
                  <Text size="sm" className="font-medium">
                    Subtotal
                  </Text>
                </Grid.Col>
              </Grid>

              {block?.items.map((item) => (
                <Grid key={item?.id}>
                  <Grid.Col span={5}>
                    <Input
                      id={`${item.id}--description`}
                      name="description"
                      defaultValue={item.description}
                      size="xs"
                      onChange={handleItemChange}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Group spacing="xs" grow>
                      <Input
                        type="number"
                        id={`${item.id}--units`}
                        name="units"
                        defaultValue={item.units}
                        size="xs"
                        onChange={handleItemChange}
                        min={0}
                      />
                      <NativeSelect
                        size="xs"
                        id={`${item.id}--unitsType`}
                        name={`${item.id}--unitsType`}
                        onChange={handleSelectItemChange}
                        defaultValue={item.unitsType}
                        data={[
                          { value: 'units', label: 'units' },
                          { value: 'hrs', label: 'hrs' },
                        ]}
                      />
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Input
                      type="number"
                      id={`${item.id}--rate`}
                      name="rate"
                      defaultValue={item.rate}
                      size="xs"
                      onChange={handleItemChange}
                      min={0}
                    />
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Text
                      size="sm"
                      className="flex justify-end items-center h-full w-full"
                    >
                      {getProposalItemSubtotal(item)}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Box className="flex justify-end items-center h-full w-full">
                      <ActionIcon
                        color="red"
                        onClick={() => handleDeleteItem(block, item.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Box>
                  </Grid.Col>
                </Grid>
              ))}
              <Box mt={12}>
                <Button
                  variant="default"
                  size="xs"
                  leftIcon={<IconPlus size={14} />}
                  onClick={handleAddItem}
                >
                  Add item
                </Button>
              </Box>
            </Box>

            <Divider className="my-3" />

            <Grid>
              <Grid.Col span={7}></Grid.Col>
              <Grid.Col span={5}>
                <Box>
                  <Group direction="column" grow>
                    <Group position="apart" align="center">
                      <Text size="sm" className="font-medium">
                        Subtotal
                      </Text>
                      <Text size="sm">
                        {formatCurrency(getProposalSubtotal(block?.items))}
                      </Text>
                    </Group>
                    <Group position="apart" align="center">
                      <Text size="sm" className="font-medium">
                        Discount
                      </Text>
                      <Input
                        className="w-[85px]"
                        placeholder="0"
                        name="discount"
                        defaultValue={block.discount}
                        onChange={handleDiscountChange}
                        type="number"
                        size="xs"
                        min={0}
                      />
                    </Group>
                    <Divider className="mt-1" />
                    <Group position="apart" align="center">
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
    </Box>
  );
}
