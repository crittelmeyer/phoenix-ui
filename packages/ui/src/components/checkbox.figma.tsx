import React from 'react'
import figma from '@figma/code-connect'
import { Checkbox } from './checkbox'
import { Label } from './label'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  Checkbox,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      checked: figma.boolean('Checked'),
      disabled: figma.boolean('Disabled'),
    },
    example: (props) => (
      <div className="flex items-center space-x-2">
        <Checkbox id="checkbox" {...props} />
        <Label htmlFor="checkbox">Accept terms and conditions</Label>
      </div>
    ),
  },
)
