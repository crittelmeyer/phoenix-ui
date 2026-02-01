import React from 'react'
import figma from '@figma/code-connect'
import { Label } from './label'
import { RadioGroup, RadioGroupItem } from './radio-group'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  RadioGroup,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      disabled: figma.boolean('Disabled'),
    },
    example: (props) => (
      <RadioGroup {...props}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option3" id="option3" />
          <Label htmlFor="option3">Option 3</Label>
        </div>
      </RadioGroup>
    ),
  },
)
