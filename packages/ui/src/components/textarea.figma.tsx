import React from 'react'
import figma from '@figma/code-connect'
import { Textarea } from './textarea'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  Textarea,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      placeholder: figma.string('Placeholder'),
      autoResize: figma.boolean('Auto Resize'),
      disabled: figma.boolean('Disabled'),
    },
    example: (props) => <Textarea {...props} />,
  },
)
