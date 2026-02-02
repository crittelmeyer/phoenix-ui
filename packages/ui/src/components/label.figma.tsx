import React from 'react'
import figma from '@figma/code-connect'
import { Label } from './label'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  Label,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      children: figma.string('Label Text'),
    },
    example: (props) => <Label htmlFor="input-id">{props.children}</Label>,
  },
)
