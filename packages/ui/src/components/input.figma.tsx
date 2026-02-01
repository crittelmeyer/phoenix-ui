import React from 'react'
import figma from '@figma/code-connect'
import { Input } from './input'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  Input,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      type: figma.enum('Type', {
        Text: 'text',
        Email: 'email',
        Password: 'password',
        Number: 'number',
      }),
      placeholder: figma.string('Placeholder'),
      disabled: figma.boolean('Disabled'),
    },
    example: (props) => <Input {...props} />,
  },
)
