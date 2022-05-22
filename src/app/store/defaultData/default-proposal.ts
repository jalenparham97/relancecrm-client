import { nanoid } from 'nanoid';
import { CreateProposal } from '@/core/types';

export const DefaultProposal: CreateProposal = {
  content: [
    {
      id: nanoid(8),
      type: 'text',
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Overview & Goals',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Describe the overview of the project and its goals...',
            },
          ],
        },
      ],
    },
    {
      id: nanoid(8),
      type: 'text',
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Scope of Work',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Include information such as what you plan on doing, how long it will take, and what the final product might be...',
            },
          ],
        },
      ],
    },
    {
      id: nanoid(8),
      type: 'timeline',
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Timeline',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Objective',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Describe objective…',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'More information…',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Timeline',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Describe details of timeline…',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'More information…',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: nanoid(8),
      type: 'estimate',
      discount: 0,
      subtotal: 0,
      total: 0,
      items: [
        {
          id: nanoid(8),
          description: '',
          rate: 0,
          units: 0,
          unitsType: 'units',
        },
      ],
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Estimate',
            },
          ],
        },
      ],
    },
    {
      id: nanoid(8),
      type: 'text',
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Additional Services',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Describe additional services that you can provide...',
            },
          ],
        },
      ],
    },
    {
      id: nanoid(8),
      type: 'text',
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Why me?',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Tell the client all about you and why it would be in their best interest to work with you...',
            },
          ],
        },
      ],
    },
  ],
};
